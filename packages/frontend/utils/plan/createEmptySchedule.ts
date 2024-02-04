import {
  Schedule2,
  ScheduleYear2,
  SeasonEnum,
  StatusEnum,
} from "@graduate/common";

/** Create an empty schedule with 4 academic years and no classes. */
export const createEmptySchedule = (): Schedule2<null> => {
  const years: ScheduleYear2<null>[] = [];
  for (let year = 1; year <= 4; year++) {
    years.push(createEmptyYear(year));
  }

  return {
    years,
  };
};

export const createEmptyYear = (year: number): ScheduleYear2<null> => {
  return {
    year,
    fall: {
      season: SeasonEnum.FL,
      status: StatusEnum.CLASSES,
      classes: [],
      id: null,
    },
    spring: {
      season: SeasonEnum.SP,
      status: StatusEnum.CLASSES,
      classes: [],
      id: null,
    },
    summer1: {
      season: SeasonEnum.S1,
      status: StatusEnum.INACTIVE,
      classes: [],
      id: null,
    },
    summer2: {
      season: SeasonEnum.S2,
      status: StatusEnum.INACTIVE,
      classes: [],
      id: null,
    },
    isSummerFull: false,
  };
};
