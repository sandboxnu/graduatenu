import bscs from "@graduate/scrapers-v2/test/bscs-tokens.json"
import { parseRows } from "../parse/parse"
import { HRow, HRowType } from "@graduate/scrapers-v2/src/tokenize/types";


const bscsTokens: HRow[] = [
      // {
      //     "hour": 0,
      //     "description": "Computer Science Overview",
      //     "type":HRowType.HEADER
      // },
      {
          "hour": 1,
          "description": "First Year Seminar",
          "type": HRowType.PLAIN_COURSE,
          "subject": "CS",
          "classId": 1200
      },
      {
          "hour": 1,
          "description": "Professional Development for Khoury Co-op",
          "type":HRowType.PLAIN_COURSE,
          "subject": "CS",
          "classId": 1210
      },
      // {
      //     "hour": 0,
      //     "description": "Computer Science Fundamental Courses",
      //     "type":HRowType.HEADER
      // },
      {
          "hour": 5,
          "type":HRowType.AND_COURSE,
          "description": "Discrete Structures and Seminar for CS 1800",
          "courses": [
              {
                  "subject": "CS",
                  "classId": 1800,
                  "description": "Discrete Structures"
              },
              {
                  "subject": "CS",
                  "classId": 1802,
                  "description": "Seminar for CS 1800"
              }
          ]
      },
      {
          "hour": 5,
          "type":HRowType.AND_COURSE,
          "description": "Fundamentals of Computer Science 1 and Lab for CS 2500",
          "courses": [
              {
                  "subject": "CS",
                  "classId": 2500,
                  "description": "Fundamentals of Computer Science 1"
              },
              {
                  "subject": "CS",
                  "classId": 2501,
                  "description": "Lab for CS 2500"
              }
          ]
      },
      {
          "hour": 5,
          "type":HRowType.AND_COURSE,
          "description": "Fundamentals of Computer Science 2 and Lab for CS 2510",
          "courses": [
              {
                  "subject": "CS",
                  "classId": 2510,
                  "description": "Fundamentals of Computer Science 2"
              },
              {
                  "subject": "CS",
                  "classId": 2511,
                  "description": "Lab for CS 2510"
              }
          ]
      },
      {
          "hour": 4,
          "description": "Mathematics of Data Models",
          "type":HRowType.PLAIN_COURSE,
          "subject": "CS",
          "classId": 2810
      },
      // {
      //     "hour": 0,
      //     "description": "Computer Science Required Courses",
      //     "type":HRowType.HEADER
      // },
      {
          "hour": 4,
          "description": "Algorithms and Data",
          "type":HRowType.PLAIN_COURSE,
          "subject": "CS",
          "classId": 3000
      },
      {
          "hour": 5,
          "type":HRowType.AND_COURSE,
          "description": "Object-Oriented Design and Lab for CS 3500",
          "courses": [
              {
                  "subject": "CS",
                  "classId": 3500,
                  "description": "Object-Oriented Design"
              },
              {
                  "subject": "CS",
                  "classId": 3501,
                  "description": "Lab for CS 3500"
              }
          ]
      },
      {
          "hour": 4,
          "description": "Computer Systems",
          "type":HRowType.PLAIN_COURSE,
          "subject": "CS",
          "classId": 3650
      },
      {
          "hour": 4,
          "description": "Theory of Computation",
          "type":HRowType.PLAIN_COURSE,
          "subject": "CS",
          "classId": 3800
      },
      {
          "hour": 4,
          "description": "Software Development",
          "type":HRowType.PLAIN_COURSE,
          "subject": "CS",
          "classId": 4500
      },
      {
          "hour": 0,
          "description": "Fundamentals of Software Engineering",
          "type":HRowType.OR_COURSE,
          "subject": "CS",
          "classId": 4530
      },
      // {
      //     "hour": 0,
      //     "description": "Security Required Course",
      //     "type":HRowType.HEADER
      // },
      // {
      //     "hour": 4,
      //     "description": "Complete one of the following:",
      //     "type":HRowType.COMMENT
      // },
      {
          "hour": 0,
          "description": "Foundations of Cybersecurity",
          "type":HRowType.PLAIN_COURSE,
          "subject": "CY",
          "classId": 2550
      },
      {
          "hour": 0,
          "description": "Systems Security",
          "type":HRowType.PLAIN_COURSE,
          "subject": "CY",
          "classId": 3740
      },
      {
          "hour": 0,
          "description": "Network Security",
          "type":HRowType.PLAIN_COURSE,
          "subject": "CY",
          "classId": 4740
      },
      // {
      //     "hour": 0,
      //     "description": "Presentation Requirement",
      //     "type":HRowType.HEADER
      // },
      // {
      //     "hour": 4,
      //     "description": "Choose one:",
      //     "type":HRowType.COMMENT
      // },
      {
          "hour": 0,
          "description": "Public Speaking",
          "type":HRowType.PLAIN_COURSE,
          "subject": "COMM",
          "classId": 1112
      },
      {
          "hour": 0,
          "description": "Business and Professional Speaking",
          "type":HRowType.PLAIN_COURSE,
          "subject": "COMM",
          "classId": 1113
      },
      {
          "hour": 0,
          "description": "Persuasion and Rhetoric",
          "type":HRowType.PLAIN_COURSE,
          "subject": "COMM",
          "classId": 1210
      },
      {
          "hour": 0,
          "description": "Communication and Storytelling",
          "type":HRowType.PLAIN_COURSE,
          "subject": "COMM",
          "classId": 1511
      },
      {
          "hour": 0,
          "description": "Improvisation",
          "type":HRowType.PLAIN_COURSE,
          "subject": "THTR",
          "classId": 1125
      },
      {
          "hour": 0,
          "description": "Introduction to Acting",
          "type":HRowType.PLAIN_COURSE,
          "subject": "THTR",
          "classId": 1130
      },
      {
          "hour": 0,
          "description": "The Dynamic On-Screen Presenter",
          "type":HRowType.PLAIN_COURSE,
          "subject": "THTR",
          "classId": 1180
      },
      {
          "hour": 0,
          "description": "Acting for the Camera",
          "type":HRowType.PLAIN_COURSE,
          "subject": "THTR",
          "classId": 2345
      },
      // {
      //     "hour": 0,
      //     "description": "Khoury Elective Courses",
      //     "type":HRowType.HEADER
      // },
      // {
      //     "hour": 0,
      //     "description": "With adviser approval, directed study, research, project study, and appropriate graduate-level courses may also be taken as upper-division electives.",
      //     "type":HRowType.COMMENT
      // },
      // {
      //     "hour": 8,
      //     "description": "Complete 8 credits of CS, CY, DS, or IS classes that are not already required. Choose courses within the following ranges:",
      //     "type":HRowType.COMMENT
      // },
      {
          "type":HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS,
          "hour": 0,
          "subject": "CS",
          "classIdStart": 2500,
          "exceptions": [
              {
                  "subject": "CS",
                  "classId": 5010
              }
          ]
      },
      {
          "type":HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS,
          "hour": 0,
          "subject": "CY",
          "classIdStart": 2000,
          "exceptions": [
              {
                  "subject": "CY",
                  "classId": 4930
              }
          ]
      },
      {
          "type":HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS,
          "hour": 0,
          "subject": "DS",
          "classIdStart": 2500,
          "exceptions": [
              {
                  "subject": "DS",
                  "classId": 4900
              }
          ]
      },
      {
          "type":HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS,
          "hour": 0,
          "subject": "IS",
          "classIdStart": 2000,
          "exceptions": [
              {
                  "subject": "IS",
                  "classId": 4900
              }
          ]
      }
  ]

const parsed = parseRows(bscsTokens)
console.log(JSON.stringify(parsed, null, 4))

export {}