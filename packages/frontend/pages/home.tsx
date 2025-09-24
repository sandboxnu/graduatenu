import { Box, Divider, Flex, Button } from "@chakra-ui/react";
import {
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  pointerWithin,
  rectIntersection,
  useDroppable,
} from "@dnd-kit/core";
import { API } from "@graduate/api-client";
import {
  CoReqWarnings,
  PlanModel,
  PreReqWarnings,
  ScheduleCourse2,
} from "@graduate/common";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import {
  AddPlanModal,
  DeletePlanModal,
  DraggedScheduleCourse,
  EditPlanModal,
  GraduatePostAuthHeader,
  GraduatePreAuthHeader,
  LoadingPage,
  NoMajorSidebar,
  NoPlanSidebar,
  Plan,
  PlanDropdown,
  Sidebar,
  TransferCourses,
} from "../components";
import { DuplicatePlanButton } from "../components/Plan/DuplicatePlanButton";
import { fetchStudentAndPrepareForDnd, useStudentWithPlans } from "../hooks";
import {
  DELETE_COURSE_AREA_DND_ID,
  cleanDndIdsFromPlan,
  handleApiClientError,
  logger,
  toast,
  updatePlanForStudent,
  updatePlanOnDragEnd,
} from "../utils";
import {
  getCoReqWarnings,
  getPreReqWarnings,
} from "../utils/plan/preAndCoReqCheck";
import { IsGuestContext } from "./_app";
import { RepeatIcon } from "@chakra-ui/icons";

// Algorithm to decide which droppable the course is currently over (if any).
// See https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms for more info.
const courseDndCollisisonAlgorithm: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  } else {
    // Fallback as recommended by the dnd-kit docs
    return rectIntersection(args);
  }
};

const HomePage: NextPage = () => {
  const { error, student, mutateStudent } = useStudentWithPlans();
  const router = useRouter();

  /*
   * Keep track of the plan being displayed, initially undef and later either the plan id or null.
   * undef is used to indicate the initial state where the primary plan should be used, null is to define
   * the state where no plan should be used.
   */
  const [selectedPlanId, setSelectedPlanId] = useState<
    number | undefined | null
  >();

  const [activeCourse, setActiveCourse] =
    useState<ScheduleCourse2<string> | null>(null);

  const [isRemove, setIsRemove] = useState<boolean>(false);

  const [coReqWarnings, setCoReqWarnings] = useState<CoReqWarnings | undefined>(
    undefined
  );
  const [preReqWarnings, setPreReqWarnings] = useState<
    PreReqWarnings | undefined
  >(undefined);

  const [isTransferCoursesExpanded, setIsTransferCoursesExpanded] =
    useState<boolean>(false);

  const [lastDeletedPlan, setLastDeletedPlan] = useState<any | null>(null);
  const { isGuest } = useContext(IsGuestContext);

  useEffect(() => {
    // once the student is fetched, set the selected plan id to the last updated plan
    if (student && selectedPlanId === undefined) {
      if (student.plans.length > 0) {
        const sortedPlans = student.plans.sort(
          (p1, p2) =>
            new Date(p2.updatedAt).getTime() - new Date(p1.updatedAt).getTime()
        );
        setSelectedPlanId(sortedPlans[0].id);
      }
    }
    if (student) {
      const plan = student.plans.find((plan) => plan.id === selectedPlanId);
      if (plan) {
        setPreReqWarnings(
          getPreReqWarnings(plan.schedule, student.coursesTransfered)
        );
        setCoReqWarnings(getCoReqWarnings(plan.schedule));
      }
    }
  }, [student, selectedPlanId, setSelectedPlanId]);

  /**
   * Render a warning modal to let users know that if they are on a guest
   * account, we don't save information
   */
  useEffect(() => {
    if (isGuest) {
      toast.warn(
        "You are logged in on a guest account. Your data will be saved locally, but not on our servers"
      );
    }
  }, [isGuest]);

  /**
   * Handle errors from useStudentWithPlans.
   *
   * Unfortunately, error could be from useStudentWithPlans or from
   * mutateStudent. But mutate student error is handled seperately by rolling
   * back the update.
   *
   * To specifically handle useStudentWithPlans error we check if the student is
   * not defined. Since if mutate student errors, student will still be defined
   * since we rollback the student state on error.
   */
  if (error && !student) {
    logger.error("HomePage", error);
    handleApiClientError(error, router);

    // If we couldn't fetch the student, show a blank page for now.
    // We might want to show some more actionable error in the future.
    return <div></div>;
  }

  // handle loading state
  if (!student) {
    return <LoadingPage />;
  }

  const selectedPlan = student.plans.find((plan) => selectedPlanId === plan.id);

  /**
   * When a course is dragged and dropped onto a semester
   *
   * 1. Create a copy of the plan with the course remove from the old schedule and
   *    place into the new schedule
   * 2. Create a copy of the student with the new updated plan
   * 3. Optimistically update the local cache with the new student so that the user
   *    sees the change immidiately
   * 4. POST the updated plan to db
   * 5. Refetch the student with the new plan and update the cache with the
   *    persisted student from our backend
   * 6. If anything goes wrong in the POST, rollback the optimistic update
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveCourse({ ...active.data.current?.course, id: active.id });
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    // no plan is being displayed right now, so abort
    if (!selectedPlan) {
      return;
    }

    const { active, over } = event;

    // create a new plan with the dragged course moved from old term to term it is dropped on
    let updatedPlan: PlanModel<string>;
    try {
      updatedPlan = updatePlanOnDragEnd(selectedPlan, active, over);
    } catch (err) {
      // update failed, either due to some logical issue or explicitely thrown error
      logger.debug("updatePlanOnDragEnd", err);
      return;
    }

    setPreReqWarnings(
      getPreReqWarnings(updatedPlan.schedule, student.coursesTransfered)
    );
    setCoReqWarnings(getCoReqWarnings(updatedPlan.schedule));
    mutateStudentWithUpdatedPlan(updatedPlan);
  };

  /**
   * POSTs the new plan, optimistically updates the SWR cache for student, and
   * rollbacks on error.
   */
  const mutateStudentWithUpdatedPlan = (updatedPlan: PlanModel<string>) => {
    // create a new student object with this updated plan so that we can do an optimistic update till the API returns
    const updatedStudent = updatePlanForStudent(student, updatedPlan);

    mutateStudent(
      async () => {
        // remove dnd ids, update the plan, and refetch the student
        const cleanedPlan = cleanDndIdsFromPlan(updatedPlan);
        if (isGuest) {
          const cleanedPlanWithUpdatedTimeStamp: PlanModel<null> = {
            ...cleanedPlan,
            updatedAt: new Date(),
          };
          window.localStorage.setItem(
            "student",
            JSON.stringify({
              ...student,
              plans: student.plans.map((plan) =>
                plan.id === cleanedPlanWithUpdatedTimeStamp.id
                  ? cleanedPlanWithUpdatedTimeStamp
                  : plan
              ),
            })
          );
        } else {
          await API.plans.update(updatedPlan.id, cleanedPlan);
        }
        return fetchStudentAndPrepareForDnd(isGuest);
      },
      {
        optimisticData: updatedStudent,
        rollbackOnError: true,
        revalidate: false,
      }
    ).catch((error) => {
      handleApiClientError(error, router);
    });
  };

  const handleUndoDelete = async () => {
    if (!lastDeletedPlan) return;

    if (isGuest) {
      window.localStorage.setItem(
        "student",
        JSON.stringify({
          ...student,
          plans: [...student.plans, lastDeletedPlan],
        })
      );
    } else {
      // Insert plan back into database
      await API.plans.create(lastDeletedPlan);
    }

    mutateStudent();
    setSelectedPlanId(lastDeletedPlan.id);
    setLastDeletedPlan(null);
    toast.success("Plan restored!");
  };

  let renderedSidebar = <NoPlanSidebar />;
  if (selectedPlan) {
    if (selectedPlan.major) {
      renderedSidebar = (
        <Sidebar
          selectedPlan={selectedPlan}
          transferCourses={student.coursesTransfered || []}
        />
      );
    } else
      renderedSidebar = (
        <NoMajorSidebar
          selectedPlan={selectedPlan}
          transferCourses={student.coursesTransfered || []}
        />
      );
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // Changes the default dnd collision algorithm to something
      // that feels more intuitive.
      collisionDetection={courseDndCollisisonAlgorithm}
    >
      <PageLayout>
        <Box
          bg="neutral.100"
          overflowY="auto"
          width={{ desktop: "360px", tablet: "300px" }}
          flexShrink={0}
        >
          {renderedSidebar}
        </Box>
        <Box p="md" overflow="auto" flexGrow={1}>
          <Flex flexDirection="column" rowGap="sm">
            <Flex alignItems="center" gap="2">
              <PlanDropdown
                selectedPlanId={selectedPlanId}
                setSelectedPlanId={setSelectedPlanId}
                plans={student.plans}
              />
              <AddPlanModal
                setSelectedPlanId={setSelectedPlanId}
                selectedPlanId={selectedPlanId}
              />
              {lastDeletedPlan && (
                <Button
                  leftIcon={<RepeatIcon />}
                  variant="solid"
                  size="md"
                  borderRadius="lg"
                  borderColor="blue.700"
                  borderWidth="2px"
                  bg="blue.100"
                  color="blue.700"
                  _hover={{ bg: "blue.200" }}
                  onClick={handleUndoDelete}
                >
                  Restore Plan
                </Button>
              )}
              {selectedPlan && <EditPlanModal plan={selectedPlan} />}
              {selectedPlan && (
                <DuplicatePlanButton
                  plan={selectedPlan}
                  setSelectedPlanId={setSelectedPlanId}
                />
              )}
              {selectedPlan && (
                <DeletePlanModal
                  setSelectedPlanId={setSelectedPlanId}
                  planName={selectedPlan.name}
                  planId={selectedPlan.id}
                  onPlanDeleted={(deletedPlan) =>
                    setLastDeletedPlan(deletedPlan)
                  }
                />
              )}
            </Flex>
            {selectedPlan && (
              <>
                <Plan
                  plan={selectedPlan}
                  coReqErr={coReqWarnings}
                  preReqErr={preReqWarnings}
                  mutateStudentWithUpdatedPlan={mutateStudentWithUpdatedPlan}
                  setIsRemove={setIsRemove}
                />
                <Divider borderColor="neutral.200" borderWidth={1} />
                <TransferCourses
                  year={selectedPlan.catalogYear}
                  isExpanded={isTransferCoursesExpanded}
                  toggleExpanded={() =>
                    setIsTransferCoursesExpanded(!isTransferCoursesExpanded)
                  }
                />
              </>
            )}
          </Flex>
        </Box>
      </PageLayout>
      <DragOverlay dropAnimation={null}>
        {activeCourse ? (
          <DraggedScheduleCourse
            activeCourse={activeCourse}
            isRemove={isRemove}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

/**
 * This will have everything that can be rendered without the student and
 * plans(i.e: header, sidebar, etc).
 */
const PageLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { setNodeRef } = useDroppable({ id: DELETE_COURSE_AREA_DND_ID });
  const { isGuest } = useContext(IsGuestContext);
  return (
    <Flex
      flexDirection="column"
      height="100vh"
      overflow="hidden"
      ref={setNodeRef}
    >
      {isGuest ? <GraduatePreAuthHeader /> : <GraduatePostAuthHeader />}
      <Flex height="100%" overflow="hidden">
        {children}
      </Flex>
    </Flex>
  );
};

export default HomePage;
