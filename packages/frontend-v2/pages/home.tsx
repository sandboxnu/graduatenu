import { NextPage } from "next";
import { Plan, ScheduleCourse } from "../components";
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
  toast,
  updatePlanForStudent,
  updatePlanOnDragEnd,
} from "../utils";
import { API } from "@graduate/api-client";
import { PlanModel, ScheduleCourse2 } from "@graduate/common";
import { useState } from "react";
import { createPortal } from "react-dom";

const HomePage: NextPage = () => {
  const { error, student, mutateStudent } = useStudentWithPlans();

  // keep track of the course being dragged around so that we can display the drag overlay
  const [activeCourse, setActiveCourse] =
    useState<ScheduleCourse2<string> | null>(null);

  if (error) {
    logger.error("Error", error);
    return <p>Error fetching student</p>;
  }

  if (!student) {
    return <p>Loading...</p>;
  }

  const primaryPlan = student.plans.find((p) => student.primaryPlanId === p.id);

  if (!primaryPlan) {
    // TODO: Handle no plan/no primary plan case
    throw new Error("Student doesn't have a valid primary plan set");
  }

  const handleDragStart = (event: DragStartEvent): void => {
    // find the course that is being dragged and set it as the active course
    const { active } = event;
    const activeCourse = findCourseByDndId(
      primaryPlan.schedule,
      active.id as string // dnd ids are strings
    );
    console.log("Active: ", activeCourse);
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
      logger.error("updatePlanOnDragEnd", err);
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
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Plan plan={primaryPlan} />
      {createPortal(
        <DragOverlay dropAnimation={undefined}>
          {activeCourse ? (
            <ScheduleCourse scheduleCourse={activeCourse} />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default HomePage;
