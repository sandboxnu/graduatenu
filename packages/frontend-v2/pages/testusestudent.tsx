import { NextPage } from "next";
import { useStudentWithPlans } from "../hooks/useStudentWithPlans";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { API } from "@graduate/api-client";
import { Button } from "@chakra-ui/react";

const TestUseStudent: NextPage = () => {

  // Perform localStorage action
  const [tokenInStorage,] = useLocalStorage("token", "");

  const {student, error, isLoading, mutateStudent} = useStudentWithPlans(tokenInStorage);
  if (error) {
    console.error(error);
    // handle error
  } else if (isLoading) {
    // handle loading
  }
  return (
    <>
      {student ? <h1> You could useStudent!</h1> : <h1> Student could not have been fetched</h1>}
      <p>{student?.fullName}</p>
      {student && (<Button
          onClick={async () => {
            const newName = "Aryan Shah Updated with Mutation";
            if (student) {
              await mutateStudent(API.student.update({fullName: newName}, tokenInStorage),
                {optimisticData: {...student, fullName: newName}});
            }
          }}>
          Use Mutation to update the name
        </Button>
      )}
    </>
  );
};

export default TestUseStudent;
