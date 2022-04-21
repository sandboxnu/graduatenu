import type { NextPage } from "next";
import { SeasonEnum } from "@graduate/common";
import { SearchAPI } from "@graduate/api-client";

const Home: NextPage = () => {
  // using a type from our common package
  const seasons: SeasonEnum[] = [
    SeasonEnum.FL,
    SeasonEnum.SP,
    SeasonEnum.S1,
    SeasonEnum.S2,
  ];

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
