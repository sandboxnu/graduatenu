import {NextPage} from "next";
import {useStudentWithPlan} from "../hooks/useStudent";
import {useLocalStorage} from "../hooks/useLocalStorage";

const TestUseStudent: NextPage = () => {

  // Perform localStorage action
  const [tokenInStorage, ] = useLocalStorage("token", "");

  const {student, error, isLoading} = useStudentWithPlan(tokenInStorage);
  if (error) {
    // handle error
  } else if (isLoading) {
    // handle loading
  }
  console.log(student);
  return (
    <>
      <h1> You could useStudent!</h1>
      <p>{student?.fullName}</p>
    </>
  );
};

export default TestUseStudent;
