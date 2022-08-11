import { NextPage } from "next";
import { usePlan } from "../hooks/usePlan";
import { useStudentWithPlans } from "../hooks/useStudentWithPlans";

const TestUsePlan: NextPage = () => {
  const {
    student,
    error: studentError,
    isLoading: studentIsLoading,
  } = useStudentWithPlans();
  if (studentError) {
    return <h1>student could not be fetched</h1>;
    // handle error
  } else if (studentIsLoading) {
    return <div>loading</div>;
  }
  return (
    <>
      {student?.plans.map((plan) => (
        <Plan key={plan.id} id={plan.id} />
      ))}
    </>
  );
};

const Plan = ({ id }: { id: number }) => {
  const { plan, error, isLoading } = usePlan(id);
  if (error) {
    return <h1>plan could not be fetched</h1>;
    // handle error
  } else if (isLoading) {
    return <div>loading</div>;
  }
  console.log(plan);

  return (
    <>
      <h1> you could usePlan!</h1>
      <p>{plan?.id}</p>
    </>
  );
};

export default TestUsePlan;
