import type { NextPage } from "next";
import { useState } from "react";
import { SearchAPI, API } from "@graduate/api-client";
import { toast, logger } from "../utils";

const Bomb: React.FC = () => {
  throw Error("BOOOOM!");
};

const Home: NextPage = () => {
  const [isClientSideError, setIsClientSideError] = useState(false);

  const [token, setToken] = useState("");
  const [planId, setPlanId] = useState<number>();

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

  return (
    <>
      <h1>GraduateNU Landing Page:</h1>
      <div>
        <h2>Testing api calls on backend v2</h2>
        <p>All responses will be logged to the console</p>

        <div>
          <h3>Auth Routes</h3>
          <button
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
              setToken(student.accessToken!);
            }}
          >
            Register
          </button>

          <button
            onClick={async () => {
              setToken("");
              console.log("Logged out, token reset");
            }}
          >
            Logout
          </button>

          <button
            onClick={async () => {
              const student = await API.auth.login({
                email: "aryan1@gmail.com",
                password: "aryan1234",
              });
              console.log(student);
              setToken(student.accessToken!);
            }}
          >
            Login
          </button>
        </div>
        <div>
          <h3>Student Routes</h3>
          <button
            onClick={async () => {
              const student = await API.student.getMe(token);
              console.log(student);
            }}
          >
            Get me
          </button>
          <button
            onClick={async () => {
              const student = await API.student.getMeWithPlan(token);
              console.log(student);
            }}
          >
            Get me with plan
          </button>
          <button
            onClick={async () => {
              const student = await API.student.update(
                {
                  fullName: "Aryan Shah Updated",
                },
                token
              );
              console.log("fullname updated");
              console.log(student);
            }}
          >
            Update me
          </button>
          <button
            onClick={async () => {
              await API.student.delete(token);
              setToken("");
              console.log("deleted user");
            }}
          >
            Delete me
          </button>
        </div>
        <div>
          <h3>Plan Routes</h3>
          <button
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
                token
              );
              console.log(plan);
              setPlanId(plan.id);
            }}
          >
            Create plan
          </button>
          <button
            onClick={async () => {
              const plan = await API.plans.update(
                planId!,
                {
                  schedule: {
                    years: [2019, 2020, 2021, 2022, 2023],
                    yearMap: {},
                  },
                },
                token
              );
              console.log("Changed 4 years to 5");
              console.log(plan);
            }}
          >
            Update created plan
          </button>
          <button
            onClick={async () => {
              const plan = await API.plans.get(planId!, token);
              console.log(plan);
            }}
          >
            Get created plan
          </button>
          <button
            onClick={async () => {
              await API.plans.delete(planId!, token);
              console.log(`deleted plan ${planId}`);
              setPlanId(undefined);
            }}
          >
            Delete created plan
          </button>
        </div>
      </div>

      <h2>SearchAPI logging!</h2>
      <div>
        <button
          onClick={() => {
            testFetchCourse("CS", "2500");
          }}
        >
          fetchCourse
        </button>
        <button
          onClick={() => {
            testSearchCourses("CS", 0, 9999);
          }}
        >
          searchCourses
        </button>
      </div>
      <br />
      <div>
        <h2>API Error Handling</h2>
        <div>
          <h3>Toasts without logging</h3>
          <button
            onClick={() =>
              toast.info("Oh btw here's some info on what you were doing")
            }
          >
            info
          </button>
          <button
            onClick={() =>
              toast.success("Whatever you were doing was successful")
            }
          >
            success
          </button>
          <button
            onClick={() =>
              toast.warn("Whatever you were doing was kinda successful")
            }
          >
            warning
          </button>
          <button
            onClick={() => toast.error("Whatever you were doing failed lol")}
          >
            error
          </button>
        </div>
      </div>
      <div>
        <h3>Toasts with logging</h3>
        <button
          onClick={() =>
            toast.info("Oh btw here's some info on what you were doing", {
              log: true,
            })
          }
        >
          info
        </button>
        <button
          onClick={() =>
            toast.success("Whatever you were doing was successful", {
              log: true,
            })
          }
        >
          success
        </button>
        <button
          onClick={() =>
            toast.warn("Whatever you were doing was kinda successful", {
              log: true,
            })
          }
        >
          warning
        </button>
        <button
          onClick={() =>
            toast.error("Whatever you were doing failed lol", { log: true })
          }
        >
          error
        </button>
      </div>
      <div>
        <h2>Client Side Error Handling</h2>
        <button
          onClick={() => {
            setIsClientSideError(true);
          }}
        >
          Trigger a client side error
        </button>
      </div>
      <div>
        <h2>Logging</h2>
        <button onClick={() => logger.info("Info log")}>info</button>
        <button onClick={() => logger.debug("Debug log")}>debug</button>
        <button onClick={() => logger.warn("Warning log")}>warning</button>
        <button onClick={() => logger.error("Error log")}>error</button>
      </div>
    </>
  );
};

export default Home;
