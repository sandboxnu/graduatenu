import { NextPage } from "next";
import { Plan } from "../components";
import { useStudentWithPlans } from "../hooks/useStudentWithPlans";
import { DndContext } from "@dnd-kit/core";
import { logger } from "../utils";

const HomePage: NextPage = () => {
  const { error, student } = useStudentWithPlans();

  if (error) {
    logger.error("Error", error);
    return <p>Error fetching student</p>;
  }

  if (!student) {
    return <p>Loading...</p>;
  }

  const primaryPlan = student.plans?.find(
    (p) => student.primaryPlanId === p.id
  );

  logger.info("Plan", primaryPlan);

  return (
    <DndContext>
      <Plan plan={primaryPlan} />
    </DndContext>
  );
};

export default HomePage;
