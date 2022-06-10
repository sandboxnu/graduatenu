import { NextPage } from "next";
import { LocalStorageKey, useLocalStorage } from "../hooks/useLocalStorage";
import { usePlan } from "../hooks/usePlan";
import { useStudentWithPlans } from "../hooks/useStudentWithPlans";

const TestUsePlan: NextPage = () => {

  // Perform localStorage action
  const [tokenInStorage,] = useLocalStorage(LocalStorageKey.token, "");

  const {student, error: studentError, isLoading: studentIsLoading} = useStudentWithPlans(tokenInStorage);
  if (studentError) {
    return (
      <h1>student could not be fetched</h1>
    )
    // handle error
  } else if (studentIsLoading) {
    // handle loading
  }
  return (
    <>
      { student?.plans.map(plan => (
        <Plan key={plan.id} id={plan.id} tokenInStorage={tokenInStorage}/>
      ))}
    </>
  );
};

const Plan = ({ id, tokenInStorage }: { id: number, tokenInStorage: string }) => {

  const {plan, error, isLoading} = usePlan(id, tokenInStorage);
  if (error) {
    return (
      <h1>plan could not be fetched</h1>
    )
    // handle error
  } else if (isLoading) {
    // handle loading
  }
  console.log(plan);

  return (
    <>
      {plan ? <h1> You could usePlan!</h1> : <h1>Plan could not have been fetched</h1>}
      <p>{plan?.id}</p>
    </>
  )
}

export default TestUsePlan;
