import type { NextPage } from "next";
import { SeasonEnum } from "@graduate/common";
import { API } from "@graduate/api-client";
import { useState } from "react";
import { SearchAPI } from "@graduate/api-client";

const Home: NextPage = () => {
  // using a type from our common package
  const seasons: SeasonEnum[] = [
    SeasonEnum.FL,
    SeasonEnum.SP,
    SeasonEnum.S1,
    SeasonEnum.S2,
  ];

  const [token, setToken] = useState("");
  const [planId, setPlanId] = useState<number>();

  // handler that calls fetchCourse from our api-client package
  const testFetchCourse = (subject: string, classId: string) => {
    SearchAPI.fetchCourse(subject.toUpperCase(), classId).then((res) =>
      console.log(res)
    );
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
      <h2>Seasons typed using types from our common package!</h2>
      {seasons.map((season) => (
        <p key={season}>{season}</p>
      ))}
      <br />
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
              await API.plans.get(planId!, token);
              console.log(`deleted plan ${planId}`);
              setPlanId(undefined);
            }}
          >
            Delete created plan
          </button>
        </div>
      </div>

      <h2>SearchAPI logging!</h2>
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
    </>
  );
};

export default Home;
