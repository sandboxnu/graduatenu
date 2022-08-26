import { NextPage } from "next";
import {
  HeaderContainer,
  LoadingPage,
  Logo,
  Plan,
  PlanDropdown,
} from "../components";
import {
  fetchStudentAndPrepareForDnd,
  useStudentWithPlans,
} from "../hooks/useStudentWithPlans";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  cleanDndIdsFromPlan,
  logger,
  logout,
  toast,
  updatePlanForStudent,
  updatePlanOnDragEnd,
} from "../utils";
import { API } from "@graduate/api-client";
import { PlanModel } from "@graduate/common";
import { useRouter } from "next/router";
import { Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { handleApiClientError } from "../utils/handleApiClientError";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    // once the student is fetched, set the selected plan id to the primary plan id
    if (student && selectedPlanId === undefined) {
      setSelectedPlanId(student.primaryPlanId);
    }
  }, [student, selectedPlanId, setSelectedPlanId]);

  // handle error state
  if (error) {
    logger.error("HomePage", error);
    handleApiClientError(error, router);

    // render just the boiler plate page since we couldn't fetch the student w plans
    return <PageLayout />;
  }

  // handle loading state
  if (!student) {
    return <LoadingPage pageLayout={PageLayout} />;
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
  const handleDragEnd = (event: DragEndEvent): void => {
    // no plan is being displayed right now, so abort
    if (!selectedPlan) {
      return;
    }

    const { active, over } = event;

    // course is not dragged over a term, so abort
    if (!over) {
      return;
    }

    // create a new plan with the dragged course moved from old term to term it is dropped on
    let updatedPlan: PlanModel<string>;
    try {
      updatedPlan = updatePlanOnDragEnd(selectedPlan, active, over);
    } catch (err) {
      // update failed, either due to some logical issue or explicitely thrown error
      logger.debug("updatePlanOnDragEnd", err);
      return;
    }

    // create a new student object with this updated plan so that we can do an optimistic update till the API returns
    const updatedStudent = updatePlanForStudent(student, updatedPlan);

    // post the new plan and update the cache
    mutateStudent(
      async () => {
        // remove dnd ids, update the plan, and refetch the student
        const cleanedPlan = cleanDndIdsFromPlan(updatedPlan);
        try {
          await API.plans.update(updatedPlan.id, cleanedPlan);
        } catch (err) {
          toast.error("Sorry! Something went wrong when updating your plan.", {
            log: true,
          });

          // rethrow the error so that swr rollbacks the update
          throw err;
        }
        return fetchStudentAndPrepareForDnd();
      },
      {
        optimisticData: updatedStudent,
        rollbackOnError: false,
        revalidate: false,
      }
    );
  };

  return (
    <PageLayout>
      <DndContext onDragEnd={handleDragEnd}>
        <Flex flexDirection="column">
          <PlanDropdown
            selectedPlanId={selectedPlanId}
            setSelectedPlanId={setSelectedPlanId}
            plans={student.plans}
          />
          {selectedPlan && <Plan plan={selectedPlan} />}
        </Flex>
      </DndContext>
    </PageLayout>
  );
};

/**
 * This will have everything that can be rendered without the student and
 * plans(i.e: header, sidebar, etc)
 */
const PageLayout: React.FC = ({ children }) => {
  return (
    <Flex flexDirection="column" height="100vh">
      <Header />
      <Grid flex={1} templateColumns="repeat(4, 1fr)" gap="md">
        <GridItem colSpan={1} bg="primary.blue.light.main" />
        <GridItem colSpan={3} p="md">
          {children}
        </GridItem>
      </Grid>
    </Flex>
  );
};

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <HeaderContainer>
      <Logo />
      <Button size="sm" onClick={() => logout(router)}>
        Logout
      </Button>
    </HeaderContainer>
  );
};

export default HomePage;
