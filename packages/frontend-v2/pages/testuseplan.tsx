import {NextPage} from "next";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {usePlan} from "../hooks/usePlan";

const TestUsePlan: NextPage = () => {

  // Perform localStorage action
  const [planInStorage,] = useLocalStorage("plan", 0);
  const [tokenInStorage,] = useLocalStorage("token", "");

  const {plan, error, isLoading} = usePlan(planInStorage, tokenInStorage);
  if (error) {
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
  );
};

export default TestUsePlan;
