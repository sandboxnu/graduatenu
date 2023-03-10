import { Box, Button, Flex } from "@chakra-ui/react";
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
import { PropsWithChildren, useEffect, useState } from "react";
import {
  AddPlanModal,
  AddYearButton,
  DeletePlanModal,
  DraggedScheduleCourse,
  EditPlanModal,
  LoadingPage,
  Plan,
  PlanDropdown,
  Sidebar,
  SidebarContainer,
} from "../components";
import { GraduateHeader } from "../components/Header/GraduateHeader";
import { fetchStudentAndPrepareForDnd, useStudentWithPlans } from "../hooks";
import {
  cleanDndIdsFromPlan,
  DELETE_COURSE_AREA_DND_ID,
  handleApiClientError,
  logger,
  logout,
  updatePlanForStudent,
  updatePlanOnDragEnd,
} from "../utils";
import {
  getCoReqWarnings,
  getPreReqWarnings,
} from "../utils/plan/preAndCoReqCheck";

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

  useEffect(() => {
    // once the student is fetched, set the selected plan id to the primary plan id
    if (student && selectedPlanId === undefined) {
      setSelectedPlanId(student.primaryPlanId);
    }
    if (student) {
      const plan = student.plans.find((plan) => plan.id === selectedPlanId);
      if (plan) {
        setPreReqWarnings(getPreReqWarnings(plan.schedule));
        setCoReqWarnings(getCoReqWarnings(plan.schedule));
      }
    }
  }, [student, selectedPlanId, setSelectedPlanId]);

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

    setPreReqWarnings(getPreReqWarnings(updatedPlan.schedule));
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
        await API.plans.update(updatedPlan.id, cleanedPlan);
        return fetchStudentAndPrepareForDnd();
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
          bg="primary.blue.light.main"
          overflowY="auto"
          width="360px"
          flexShrink={0}
        >
          {selectedPlan === undefined ? (
            <SidebarContainer title="No plan selected" />
          ) : (
            <Sidebar selectedPlan={selectedPlan} />
          )}
        </Box>
        <Box p="md" overflow="auto" flexGrow={1}>
          <Flex flexDirection="column">
            <Flex alignItems="center" mb="sm">
              <PlanDropdown
                selectedPlanId={selectedPlanId}
                setSelectedPlanId={setSelectedPlanId}
                plans={student.plans}
              />
              <ConfirmEmailWarningModal student={student} />
              <AddPlanModal setSelectedPlanId={setSelectedPlanId} />
              {selectedPlan && <EditPlanModal plan={selectedPlan} />}
              {selectedPlan && (
                <DeletePlanModal
                  setSelectedPlanId={setSelectedPlanId}
                  planName={selectedPlan.name}
                  planId={selectedPlan.id}
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
                <Flex mt="sm">
                  <AddYearButton
                    plan={selectedPlan}
                    mutateStudentWithUpdatedPlan={mutateStudentWithUpdatedPlan}
                  />
                </Flex>
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
  return (
    <Flex
      flexDirection="column"
      height="100vh"
      overflow="hidden"
      ref={setNodeRef}
    >
      <Header />
      <Flex height="100%" overflow="hidden">
        {children}
      </Flex>
    </Flex>
  );
};

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <GraduateHeader
      rightContent={
        <Button size="sm" onClick={() => logout(router)}>
          Logout
        </Button>
      }
    />
  );
};

export default HomePage;
