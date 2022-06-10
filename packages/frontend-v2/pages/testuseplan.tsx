import { NextPage } from "next";
import { LocalStorageKey, useLocalStorage } from "../hooks/useLocalStorage";
import { usePlan } from "../hooks/usePlan";
import { useStudentWithPlans } from "../hooks/useStudentWithPlans";

const TestUsePlan: NextPage = () => {
  // Perform localStorage action
  const [tokenInStorage] = useLocalStorage(LocalStorageKey.Token, "");

  const {
    student,
    error: studentError,
    isLoading: studentIsLoading,
  } = useStudentWithPlans(tokenInStorage);
  if (studentError) {
    return <h1>student could not be fetched</h1>;
    // handle error
  } else if (studentIsLoading) {
    return <div>loading</div>;
  }
  return (
    <>
      {student?.plans.map((plan) => (
        <Plan key={plan.id} id={plan.id} tokenInStorage={tokenInStorage} />
      ))}
    </>
  );
};

const Plan = ({
  id,
  tokenInStorage,
}: {
  id: number;
  tokenInStorage: string;
}) => {
  const { plan, error, isLoading } = usePlan(id, tokenInStorage);
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
