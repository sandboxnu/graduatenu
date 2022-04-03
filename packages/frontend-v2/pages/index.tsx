import type { NextPage } from "next";
import { SeasonEnum } from "@graduate/common";

const Home: NextPage = () => {
  // using a type from our common package
  const seasons: SeasonEnum[] = [
    SeasonEnum.FL,
    SeasonEnum.SP,
    SeasonEnum.S1,
    SeasonEnum.S2,
  ];

  return (
    <>
      <h1>GraduateNU Landing Page:</h1>
      <h2>Seasons typed using types from our common package!</h2>
      {seasons.map((season) => (
        <p key={season}>{season}</p>
      ))}
    </>
  );
};

export default Home;
