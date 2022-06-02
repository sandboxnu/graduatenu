import { NextPage } from "next";
import { useStudentWithPlan } from "../hooks/useStudent";
import { useEffect, useState } from "react";

const TestUseStudent: NextPage = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    // Perform localStorage action
    setToken(String(localStorage.getItem("token")));
  }, []);

  const { student, error, isLoading } = useStudentWithPlan(token);
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
