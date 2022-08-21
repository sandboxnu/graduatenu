import { NextPage } from "next";
import {
  HeaderContainer,
  LoadingPage,
  Logo,
  Plan,
  ScheduleCourse,
} from "../components";
import {
  fetchStudentAndPrepareForDnd,
  useStudentWithPlans,
} from "../hooks/useStudentWithPlans";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  cleanDndIdsFromPlan,
  findCourseByDndId,
  logger,
  logout,
  toast,
  updatePlanForStudent,
  updatePlanOnDragEnd,
} from "../utils";
import { API } from "@graduate/api-client";
import { PlanModel, ScheduleCourse2 } from "@graduate/common";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/react";

const HomePage: NextPage = () => {
  const router = useRouter();
  const { error, student, mutateStudent } = useStudentWithPlans();

  // keep track of the course being dragged around so that we can display the drag overlay
  const [activeCourse, setActiveCourse] =
    useState<ScheduleCourse2<string> | null>(null);

  if (error) {
    logger.error("HomePage", error);
    return (
      <PageLayout>
        <p>Error loading page</p>
      </PageLayout>
    );
  }

  if (!student) {
    return <LoadingPage header={<Header />} />;
  }

  const primaryPlan = student.plans.find((p) => student.primaryPlanId === p.id);

  if (!primaryPlan) {
    // TODO: Handle no plan/no primary plan case
    return (
      <PageLayout>
        <p>Student has no primary plan</p>
      </PageLayout>
    );
  }

  const handleDragStart = (event: DragStartEvent): void => {
    // find the course that is being dragged and set it as the active course
    const { active } = event;
    const activeCourse = findCourseByDndId(
      primaryPlan.schedule,
      active.id as string // dnd ids are strings
    );
    if (activeCourse) {
      setActiveCourse(activeCourse);
    }
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    // no course is being dragged around anymore
    setActiveCourse(null);

    const { active, over } = event;

    // course is not dragged over a term
    if (!over) {
      return;
    }

    // create a new plan with the dragged course moved from old term to term it is dropped on
    let updatedPlan: PlanModel<string>;
    try {
      updatedPlan = updatePlanOnDragEnd(primaryPlan, active, over);
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
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Plan plan={primaryPlan} />
        <DragOverlay dropAnimation={undefined}>
          {activeCourse ? (
            <ScheduleCourse scheduleCourse={activeCourse} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </PageLayout>
  );
};

const PageLayout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
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
