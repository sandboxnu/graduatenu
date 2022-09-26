import {
  Schedule2,
  ScheduleYear2,
  SeasonEnum,
  StatusEnum,
} from "@graduate/common";

/** Create an empty schedule with 4 academic years and no classes. */
export const createEmptySchedule = (): Schedule2<null> => {
  let years: ScheduleYear2<null>[] = [];
  for (let year = 1; year <= 4; year++) {
    years.push({
      year,
      fall: {
        year,
        season: SeasonEnum.FL,
        status: StatusEnum.CLASSES,
        classes: [],
        id: null,
      },
      spring: {
        year,
        season: SeasonEnum.SP,
        status: StatusEnum.CLASSES,
        classes: [],
        id: null,
      },
      summer1: {
        year,
        season: SeasonEnum.S1,
        status: StatusEnum.INACTIVE,
        classes: [],
        id: null,
      },
      summer2: {
        year,
        season: SeasonEnum.S2,
        status: StatusEnum.INACTIVE,
        classes: [],
        id: null,
      },
      isSummerFull: false,
    });
  }

  return {
    years,
  };
};
