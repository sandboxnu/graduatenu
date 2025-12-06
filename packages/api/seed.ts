import { createDatabaseConnection } from "./connection";
import { Connection } from "typeorm";
import { Student } from "./src/student/entities/student.entity";
import { Plan } from "./src/plan/entities/plan.entity";
import { SeasonEnum, StatusEnum, Schedule2 } from "@graduate/common";

const randomPick = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const majors = [
  "Computer Science, BSCS",
  "Data Science, BS",
  "Business Administration, BSBA",
  "Biology, BS",
  "Mechanical Engineering, BSME",
  "Psychology, BS",
  "Mathematics, BS",
  "Cybersecurity, BS",
];

const concentrations: Record<string, string[]> = {
  "Computer Science, BSCS": [
    "Artificial Intelligence",
    "Cybersecurity",
    "Software",
    "Systems",
    "Human-Centered Computing",
  ],
  "Data Science, BS": [
    "Machine Learning",
    "Analytics",
    "Computational Social Science",
  ],
  "Business Administration, BSBA": ["Finance", "Marketing", "Entrepreneurship"],
  "Biology, BS": ["Molecular Biology", "Ecology", "Neuroscience"],
};

const courses = [
  {
    subject: "CS",
    classId: "1200",
    name: "First Year Seminar",
    numCreditsMin: 1,
    numCreditsMax: 1,
  },
  {
    subject: "CS",
    classId: "1210",
    name: "Professional Development",
    numCreditsMin: 1,
    numCreditsMax: 1,
  },
  {
    subject: "CS",
    classId: "1800",
    name: "Discrete Structures",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "CS",
    classId: "2500",
    name: "Fundamentals of CS 1",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "CS",
    classId: "2510",
    name: "Fundamentals of CS 2",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "CS",
    classId: "3500",
    name: "Object-Oriented Design",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "CS",
    classId: "3650",
    name: "Computer Systems",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "CS",
    classId: "4500",
    name: "Software Engineering",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "CS",
    classId: "4530",
    name: "Fundamentals of Software Engineering",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },

  {
    subject: "MATH",
    classId: "1341",
    name: "Calculus 1",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "MATH",
    classId: "1342",
    name: "Calculus 2",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "MATH",
    classId: "2331",
    name: "Linear Algebra",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "MATH",
    classId: "3081",
    name: "Probability and Statistics",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },

  {
    subject: "DS",
    classId: "2000",
    name: "Programming with Data",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "DS",
    classId: "2500",
    name: "Intermediate Programming with Data",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "DS",
    classId: "3000",
    name: "Foundations of Data Science",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "DS",
    classId: "4400",
    name: "Machine Learning 1",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },

  {
    subject: "PHYS",
    classId: "1151",
    name: "Physics for Engineers 1",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "PHYS",
    classId: "1152",
    name: "Physics for Engineers 2",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "CHEM",
    classId: "1151",
    name: "General Chemistry 1",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "BIOL",
    classId: "1111",
    name: "General Biology 1",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },

  {
    subject: "ENGW",
    classId: "1111",
    name: "First Year Writing",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "ENGW",
    classId: "3302",
    name: "Advanced Writing in Sciences",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },

  {
    subject: "ACCT",
    classId: "1201",
    name: "Financial Accounting",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "MGMT",
    classId: "2301",
    name: "Organizational Behavior",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "FINA",
    classId: "2201",
    name: "Corporate Finance",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },

  {
    subject: "PSYC",
    classId: "1101",
    name: "Foundations of Psychology",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "ECON",
    classId: "1115",
    name: "Principles of Economics",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "PHIL",
    classId: "1101",
    name: "Introduction to Philosophy",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "SOCL",
    classId: "1101",
    name: "Introduction to Sociology",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
  {
    subject: "HIST",
    classId: "1130",
    name: "World History",
    numCreditsMin: 4,
    numCreditsMax: 4,
  },
];

const minors = [
  "Mathematics",
  "Business",
  "Psychology",
  "Economics",
  "Philosophy",
  null,
];
const coopCycles = ["4 Year 1 Co-op", "5 Year 2 Co-op", "5 Year 3 Co-op"];

const firstNames = [
  "Alex",
  "Bryan",
  "Casey",
  "Daniel",
  "Edward",
  "Fiona",
  "Gary",
  "Henry",
  "Indo",
  "Jason",
];
const lastNames = [
  "Ansel",
  "Baboolal",
  "Ramos",
  "Brown",
  "Jones",
  "Garcia",
  "Guerra",
  "Davis",
  "Rivera",
  "Martinez",
];

function getMockTerm(season: SeasonEnum, isSummer = false) {
  const isCoop = isSummer ? Math.random() < 0.3 : Math.random() < 0.15;
  const isInactive = isSummer && !isCoop && Math.random() < 0.6;
  const numClasses =
    isCoop || isInactive ? 0 : Math.floor(Math.random() * 2) + 3;

  return {
    season,
    status: isCoop
      ? StatusEnum.COOP
      : isInactive
      ? StatusEnum.INACTIVE
      : StatusEnum.CLASSES,
    classes: Array(numClasses)
      .fill(null)
      .map(() => {
        const course = randomPick(courses);
        return {
          subject: course.subject,
          classId: course.classId,
          name: course.name,
          numCreditsMin: course.numCreditsMin,
          numCreditsMax: course.numCreditsMax,
          id: null,
        };
      }),
    id: null,
  };
}

function getMockSchedule(): Schedule2<null> {
  const years = [];
  const numYears = Math.floor(Math.random() * 2) + 4;

  for (let year = 1; year <= numYears; year++) {
    const yearSchedule = {
      year,
      fall: getMockTerm(SeasonEnum.FL),
      spring: getMockTerm(SeasonEnum.SP),
      summer1: getMockTerm(SeasonEnum.S1, true),
      summer2: getMockTerm(SeasonEnum.S2, true),
      isSummerFull: false,
    };

    years.push(yearSchedule);
  }

  return { years };
}

async function seed() {
  let connection: Connection | undefined;

  try {
    connection = await createDatabaseConnection();
    console.log("Database connected.");

    const studentRepository = connection.getRepository(Student);
    const planRepository = connection.getRepository(Plan);

    // keep or comment out depending if we want to remove
    // existing data
    console.log("Clearing existing plans..");
    await planRepository.delete({});
    console.log("Cleared existing plans");

    // make 50 mock students (change if we want more/less)
    const numStudents = 50;
    const students = [];

    console.log(`Creating ${numStudents} students..`);
    for (let i = 0; i < numStudents; i++) {
      const firstName = randomPick(firstNames);
      const lastName = randomPick(lastNames);
      const major = randomPick(majors);
      const academicYear = Math.floor(Math.random() * 5) + 1;
      const currentYear = new Date().getFullYear();

      const student = studentRepository.create({
        nuid: `00${100000 + i}`,
        fullName: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@husky.neu.edu`,
        password: "password123",
        isOnboarded: Math.random() < 0.8,
        isEmailConfirmed: Math.random() < 0.9,
        academicYear: academicYear,
        graduateYear: currentYear + (5 - academicYear),
        catalogYear: randomPick([2022, 2023, 2024, 2025]),
        major: major,
        minor: randomPick(minors),
        concentration: randomPick(concentrations[major] || [null]),
        coopCycle: randomPick(coopCycles),
        coursesCompleted: [],
        coursesTransfered: [],
      });

      // save the mock students
      const savedStudent = await studentRepository.save(student);
      students.push(savedStudent);
    }
    console.log(`All ${numStudents} students have been created.`);

    // make 3-7 plans per student
    console.log("Creating plans for each student...");
    let totalPlans = 0;

    for (let s = 0; s < students.length; s++) {
      const student = students[s];

      // change if we want each student to have more/less plans
      const numPlans = Math.floor(Math.random() * 5) + 3;

      const createdPlanIds = [];

      for (let i = 0; i < numPlans; i++) {
        const major = i === 0 ? student.major : randomPick(majors);
        const concentration = randomPick(concentrations[major] || [null]);

        const plan = planRepository.create({
          name: i === 0 ? "Main Plan" : `Plan ${i + 1}`,
          student: student,
          major: major,
          catalogYear: student.catalogYear,
          concentration: concentration,
          minor: randomPick(minors),
          schedule: getMockSchedule(),
        });

        // save the mock plans
        const savedPlan = await planRepository.save(plan);
        createdPlanIds.push(savedPlan.id);
        totalPlans++;
      }

      // setting  primary and starred plans as every student's first plan
      student.primaryPlanId = createdPlanIds[0];
      student.starredPlan = createdPlanIds[0];
      await studentRepository.save(student);
    }

    console.log(`${totalPlans} plans were created.`);

    // done
    console.log("Seeding complete.");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
      console.log("Database connection closed");
    }
  }
}

// Run the seed
seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
