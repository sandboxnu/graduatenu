import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { updatePlanForUser } from "../services/PlanService";

const test = {
  approved_schedule: {
    id: "0",
    years: [1000, 1001, 1002, 1003],
    yearMap: {
      "1000": {
        fall: {
          id: 1010,
          year: 1000,
          season: "FL",
          status: "CLASSES",
          termId: 100010,
          classes: [
            {
              name: "Algorithms and Data",
              subject: "CS",
              classId: 3000,
              prereqs: {
                type: "or",
                values: [
                  { classId: "1500", missing: true, subject: "CS" },
                  {
                    type: "and",
                    values: [
                      { classId: "2510", subject: "CS" },
                      { classId: "1800", subject: "CS" },
                    ],
                  },
                  { classId: "2160", subject: "EECE" },
                  { classId: "2162", missing: true, subject: "EECE" },
                  { classId: "2164", missing: true, subject: "EECE" },
                ],
              },
              coreqs: {
                type: "and",
                values: [{ classId: "3001", subject: "CS" }],
              },
              numCreditsMax: 4,
              numCreditsMin: 4,
              dndId: "CS 3000 1",
            },
          ],
        },
        year: 1000,
        spring: {
          id: 1030,
          year: 1000,
          season: "SP",
          status: "CLASSES",
          termId: 100030,
          classes: [],
        },
        summer1: {
          id: 1040,
          year: 1000,
          season: "S1",
          status: "CLASSES",
          termId: 100040,
          classes: [],
        },
        summer2: {
          id: 1060,
          year: 1000,
          season: "S2",
          status: "CLASSES",
          termId: 100060,
          classes: [],
        },
        isSummerFull: false,
      },
      "1001": {
        fall: {
          id: 1011,
          year: 1001,
          season: "FL",
          status: "CLASSES",
          termId: 100110,
          classes: [],
        },
        year: 1001,
        spring: {
          id: 1031,
          year: 1001,
          season: "SP",
          status: "COOP",
          termId: 100130,
          classes: [],
        },
        summer1: {
          id: 1041,
          year: 1001,
          season: "S1",
          status: "COOP",
          termId: 100140,
          classes: [],
        },
        summer2: {
          id: 1061,
          year: 1001,
          season: "S2",
          status: "CLASSES",
          termId: 100160,
          classes: [],
        },
        isSummerFull: false,
      },
      "1002": {
        fall: {
          id: 1012,
          year: 1002,
          season: "FL",
          status: "CLASSES",
          termId: 100210,
          classes: [],
        },
        year: 1002,
        spring: {
          id: 1032,
          year: 1002,
          season: "SP",
          status: "COOP",
          termId: 100230,
          classes: [],
        },
        summer1: {
          id: 1042,
          year: 1002,
          season: "S1",
          status: "COOP",
          termId: 100240,
          classes: [],
        },
        summer2: {
          id: 1062,
          year: 1002,
          season: "S2",
          status: "CLASSES",
          termId: 100260,
          classes: [],
        },
        isSummerFull: false,
      },
      "1003": {
        fall: {
          id: 1013,
          year: 1003,
          season: "FL",
          status: "CLASSES",
          termId: 100310,
          classes: [],
        },
        year: 1003,
        spring: {
          id: 1033,
          year: 1003,
          season: "SP",
          status: "CLASSES",
          termId: 100330,
          classes: [],
        },
        summer1: {
          id: 1043,
          year: 1003,
          season: "S1",
          status: "INACTIVE",
          termId: 100340,
          classes: [],
        },
        summer2: {
          id: 1063,
          year: 1003,
          season: "S2",
          status: "INACTIVE",
          termId: 100360,
          classes: [],
        },
        isSummerFull: false,
      },
    },
  },
};

const NotificationsComponent: React.FC = (props: any) => {
  const dispatch = useDispatch();
  updatePlanForUser(2, 1, test).then(response => console.log(response));
  return <div></div>;
};

export const NotificationsPage = withRouter(NotificationsComponent);
