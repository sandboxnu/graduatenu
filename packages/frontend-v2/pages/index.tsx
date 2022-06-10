import type { NextPage } from "next";
import { useState } from "react";
import { API, SearchAPI } from "@graduate/api-client";
import { logger, toast } from "../utils";
import { LocalStorageKey, useLocalStorage } from "../hooks/useLocalStorage";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import { GetStudentResponse } from "@graduate/common";

const Bomb: React.FC = () => {
  throw Error("BOOOOM!");
};

const Home: NextPage = () => {
  const [isClientSideError, setIsClientSideError] = useState(false);

  const [planId, setPlanId] = useState<number>();
  const [tokenInStorage, setTokenInStorage] = useLocalStorage(LocalStorageKey.token, "");

  if (isClientSideError) {
    return <Bomb />;
  }

  // handler that calls fetchCourse from our api-client package
  const testFetchCourse = (subject: string, classId: string) => {
    SearchAPI.fetchCourse(subject, classId).then((res) => console.log(res));
  };

  // handler that calls searchCourses from our api-client package
  const testSearchCourses = (
    searchQuery: string,
    minIndex: number,
    maxIndex: number
  ) => {
    SearchAPI.searchCourses(searchQuery, minIndex, maxIndex).then((res) =>
      console.log(res)
    );
  };

  const clearDataBase = async () => {
    const res = await axios.get("http://localhost:3002/api/students");
    const uuids = res.data.map((student: GetStudentResponse) => student.uuid);
    await Promise.all(uuids.map((uuid: string) => axios.delete(`http://localhost:3002/api/students/${uuid}`)));
    console.log("cleared students");
  }

  return (
    <>
      <h1>GraduateNU Landing Page:</h1>
      <div>
        <h2>Testing api calls on backend v2</h2>
        <p>All responses will be logged to the console</p>

        <Button
        onClick={clearDataBase}
        >Clear DB</Button>

        <div>
          <h3>Auth Routes</h3>
          <Button
            onClick={async () => {
              const student = await API.auth.register({
                fullName: "Aryan Shah",
                email: "aryan1@gmail.com",
                password: "aryan1234",
                academicYear: 2019,
                graduateYear: 2023,
                catalogYear: 2019,
                major: "Computer Science",
                nuid: "000000000",
              });
              console.log(student);
              setTokenInStorage(student.accessToken!);
            }}
          >
            Register
          </Button>

          <Button
            onClick={async () => {
              setTokenInStorage("");
              console.log("Logged out, token reset");
            }}
          >
            Logout
          </Button>

          <Button
            onClick={async () => {
              const student = await API.auth.login({
                email: "aryan1@gmail.com",
                password: "aryan1234",
              });
              console.log(student);
              // Set to local storage for use in testUseStudentPage
              console.log(
                "token set in local storage, visit testusestudent to test"
              );
              setTokenInStorage(student.accessToken!);
            }}
          >
            Login
          </Button>
        </div>
        <div>
          <h3>Student Routes</h3>
          <Button
            onClick={async () => {
              const student = await API.student.getMe(tokenInStorage);
              console.log(student);
            }}
          >
            Get me
          </Button>
          <Button
            onClick={async () => {
              const student = await API.student.getMeWithPlan(tokenInStorage);
              console.log(student);
            }}
          >
            Get me with plan
          </Button>
          <Button
            onClick={async () => {
              const student = await API.student.update(
                {
                  fullName: "Aryan Shah Updated",
                },
                tokenInStorage
              );
              console.log("fullname updated");
              console.log(student);
            }}
          >
            Update me
          </Button>
          <Button
            onClick={async () => {
              await API.student.delete(tokenInStorage);
              setTokenInStorage("");
              console.log("deleted user");
            }}
          >
            Delete me
          </Button>
        </div>
        <div>
          <h3>Plan Routes</h3>
          <Button
            onClick={async () => {
              const plan = await API.plans.create(
                {
                  name: "Plan 1",
                  major: "Computer Science",
                  coopCycle: "Fall",
                  concentration: "Software",
                  catalogYear: 2019,
                  courseWarnings: [],
                  warnings: [],
                  schedule: {
                    years: [2019, 2020, 2021, 2022],
                    yearMap: {
                      "2019": {
                        year: 2019,
                        fall: {
                          season: "FL",
                          year: 2019,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        spring: {
                          season: "SP",
                          year: 2019,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        summer1: {
                          season: "S1",
                          year: 2019,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        summer2: {
                          season: "S2",
                          year: 2019,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        isSummerFull: false,
                      },
                      "2020": {
                        year: 2020,
                        fall: {
                          season: "FL",
                          year: 2020,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        spring: {
                          season: "SP",
                          year: 2020,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        summer1: {
                          season: "S1",
                          year: 2020,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        summer2: {
                          season: "S2",
                          year: 2020,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        isSummerFull: false,
                      },
                      "2021": {
                        year: 2021,
                        fall: {
                          season: "FL",
                          year: 2021,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        spring: {
                          season: "SP",
                          year: 2021,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        summer1: {
                          season: "S1",
                          year: 2021,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        summer2: {
                          season: "S2",
                          year: 2021,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        isSummerFull: false,
                      },
                      "2022": {
                        year: 2022,
                        fall: {
                          season: "FL",
                          year: 2022,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        spring: {
                          season: "SP",
                          year: 2022,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        summer1: {
                          season: "S1",
                          year: 2022,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        summer2: {
                          season: "S2",
                          year: 2022,
                          termId: 1,
                          status: "CLASSES",
                          classes: [],
                        },
                        isSummerFull: false,
                      },
                    },
                  },
                },
                tokenInStorage
              );
              console.log(plan);
              setPlanId(plan.id);
              console.log(
                "plan set in local storage, visit testuseplan to test"
              );
            }}
          >
            Create plan
          </Button>
          <Button
            onClick={async () => {
              const plan = await API.plans.update(
                planId!,
                {
                  schedule: {
                    years: [2019, 2020, 2021, 2022, 2023],
                    yearMap: {},
                  },
                },
                tokenInStorage
              );
              console.log("Changed 4 years to 5");
              console.log(plan);
            }}
          >
            Update created plan
          </Button>
          <Button
            onClick={async () => {
              const plan = await API.plans.get(planId!, tokenInStorage);
              console.log(plan);
            }}
          >
            Get created plan
          </Button>
          <Button
            onClick={async () => {
              await API.plans.delete(planId!, tokenInStorage);
              console.log(`deleted plan ${planId}`);
              setPlanId(undefined);
            }}
          >
            Delete created plan
          </Button>
        </div>
      </div>

      <h2>SearchAPI logging!</h2>
      <div>
        <Button
          onClick={() => {
            testFetchCourse("CS", "2500");
          }}
        >
          fetchCourse
        </Button>
        <Button
          onClick={() => {
            testSearchCourses("CS", 0, 9999);
          }}
        >
          searchCourses
        </Button>
      </div>
      <br />
      <div>
        <h2>API Error Handling</h2>
        <div>
          <h3>Toasts without logging</h3>
          <Button
            onClick={() =>
              toast.info("Oh btw here's some info on what you were doing")
            }
          >
            info
          </Button>
          <Button
            onClick={() =>
              toast.success("Whatever you were doing was successful")
            }
          >
            success
          </Button>
          <Button
            onClick={() =>
              toast.warn("Whatever you were doing was kinda successful")
            }
          >
            warning
          </Button>
          <Button
            onClick={() => toast.error("Whatever you were doing failed lol")}
          >
            error
          </Button>
        </div>
      </div>
      <div>
        <h3>Toasts with logging</h3>
        <Button
          onClick={() =>
            toast.info("Oh btw here's some info on what you were doing", {
              log: true,
            })
          }
        >
          info
        </Button>
        <Button
          onClick={() =>
            toast.success("Whatever you were doing was successful", {
              log: true,
            })
          }
        >
          success
        </Button>
        <Button
          onClick={() =>
            toast.warn("Whatever you were doing was kinda successful", {
              log: true,
            })
          }
        >
          warning
        </Button>
        <Button
          onClick={() =>
            toast.error("Whatever you were doing failed lol", { log: true })
          }
        >
          error
        </Button>
      </div>
      <div>
        <h2>Client Side Error Handling</h2>
        <Button
          onClick={() => {
            setIsClientSideError(true);
          }}
        >
          Trigger a client side error
        </Button>
      </div>
      <div>
        <h2>Logging</h2>
        <Button onClick={() => logger.info("Info log")}>info</Button>
        <Button onClick={() => logger.debug("Debug log")}>debug</Button>
        <Button onClick={() => logger.warn("Warning log")}>warning</Button>
        <Button onClick={() => logger.error("Error log")}>error</Button>
      </div>
    </>
  );
};

export default Home;
