import { Grid, Paper } from "@material-ui/core";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { TransferableExam, TransferableExamGroup } from "@graduate/common";
import { setStudentExamCreditsAction } from "../state/actions/studentActions";
import {
  SelectableCourse,
  MainTitleText,
  OnboardingSelectionTemplate,
  TitleText,
} from "./GenericOnboarding";
import { APExamGroups2020To2021 } from "@graduate/common";
import { IBExamGroups2020To2021 } from "@graduate/common";
import { createPlanForUser, setPrimaryPlan } from "../services/PlanService";
import {
  getAcademicYearFromState,
  getCompletedCourseCounterFromState,
  getCompletedCourseScheduleFromState,
  getCompletedCoursesFromState,
  getGraduationYearFromState,
  getPlansFromState,
  getUserCatalogYearFromState,
  getUserConcentrationFromState,
  getUserCoopCycleFromState,
  getUserIdFromState,
  getUserMajorNameFromState,
  safelyGetTransferCoursesFromState,
} from "../state";
import { AppState } from "../state/reducers/state";
import { addNewPlanAction } from "../state/actions/userPlansActions";
import { updateUser } from "../services/UserService";
import { getAuthToken } from "../utils/auth-helpers";
import { generateBlankCompletedCourseScheduleNoCoopCycle } from "../utils";

interface TransferableExamGroupComponentProps {
  readonly transferableExamGroup: TransferableExamGroup;
  readonly selectedTransferableExams: Array<TransferableExam>;
  readonly setSelectedTransferableExams: (
    transferableExams: TransferableExam[]
  ) => void;
}

interface TransferableExamComponentProps {
  readonly transferableExam: TransferableExam;
  readonly selectedTransferableExams: Array<TransferableExam>;
  readonly setSelectedTransferableExams: (
    transferableExams: TransferableExam[]
  ) => void;
}

interface TransferableExamGroupsComponentProps {
  readonly transferableExamGroups: TransferableExamGroup[];
  readonly selectedTransferableExams: Array<TransferableExam>;
  readonly keyPrefix: string;
  readonly setSelectedTransferableExams: (
    transferableExams: TransferableExam[]
  ) => void;
}

const examEq = (e1: TransferableExam, e2: TransferableExam) =>
  e1.type === e2.type && e1.name === e2.name;
const examToString = (e: TransferableExam) => `${e.type}-${e.name}`;
/**
 * Component for displaying a single transferable exam.
 */
const TransferableExamComponent: React.FC<TransferableExamComponentProps> = ({
  transferableExam,
  selectedTransferableExams,
  setSelectedTransferableExams,
}) => {
  const filtered = selectedTransferableExams.filter(
    (exam) => !examEq(exam, transferableExam)
  );
  return (
    <SelectableCourse
      key={examToString(transferableExam)}
      checked={filtered.length !== selectedTransferableExams.length}
      courseText={transferableExam.name}
      onChange={(e) =>
        setSelectedTransferableExams(
          e.target.checked
            ? [...selectedTransferableExams, transferableExam]
            : filtered
        )
      }
    />
  );
};

/**
 * Component for displaying a group of transferable exams under a single subject.
 * For example, 2D and 3D Arts and Design are both exaums under the Arts group, so
 * this component would be used to display the entire group.
 */
const TransferableExamGroupComponent: React.FC<
  TransferableExamGroupComponentProps
> = ({
  selectedTransferableExams,
  setSelectedTransferableExams,
  transferableExamGroup: { name, transferableExams },
}) => {
  return (
    <div>
      <TitleText>{name}</TitleText>
      {transferableExams.map((exam) => (
        <TransferableExamComponent
          transferableExam={exam}
          selectedTransferableExams={selectedTransferableExams}
          setSelectedTransferableExams={setSelectedTransferableExams}
          key={`${exam.type}-${exam.name}`}
        />
      ))}
    </div>
  );
};

/**
 * Component for displaying a whole array of exam groups.
 * For example, AP exams has the groups Arts and Sciences, so
 * this component would be used to display each group.
 */
const TransferableExamGroupsComponent: React.FC<
  TransferableExamGroupsComponentProps
> = (props) => {
  return (
    <div>
      {props.transferableExamGroups.map(
        (transferableExamGroup: TransferableExamGroup) => (
          <TransferableExamGroupComponent
            transferableExamGroup={transferableExamGroup}
            selectedTransferableExams={props.selectedTransferableExams}
            setSelectedTransferableExams={props.setSelectedTransferableExams}
            key={`${props.keyPrefix}-${transferableExamGroup.name}`}
          />
        )
      )}
    </div>
  );
};

const TransferableCreditScreen: React.FC = () => {
  const {
    userId,
    major,
    concentration,
    academicYear,
    graduationYear,
    coopCycle,
    catalogYear,
    completedCourseSchedule,
    transferCourses,
    coursesCompleted,
    completedCourseCounter,
  } = useSelector(
    (state: AppState) => ({
      userId: getUserIdFromState(state),
      major: getUserMajorNameFromState(state),
      concentration: getUserConcentrationFromState(state),
      academicYear: getAcademicYearFromState(state)!,
      graduationYear: getGraduationYearFromState(state)!,
      coopCycle: getUserCoopCycleFromState(state),
      transferCourses: safelyGetTransferCoursesFromState(state),
      coursesCompleted: getCompletedCoursesFromState(state),
      completedCourseSchedule: getCompletedCourseScheduleFromState(state),
      completedCourseCounter: getCompletedCourseCounterFromState(state),
      catalogYear: getUserCatalogYearFromState(state),
      allPlans: getPlansFromState(state),
    }),
    shallowEqual
  );

  const dispatch = useDispatch();
  const [selectedTransferableExams, setSelectedTransferableExams] = useState<
    Array<TransferableExam>
  >([]);

  const onSubmit = (): Promise<any> => {
    dispatch(setStudentExamCreditsAction(selectedTransferableExams));
    const token = getAuthToken();
    const updateUserPromise = () =>
      updateUser(
        {
          id: userId!,
          token: token,
        },
        {
          major: major,
          academic_year: academicYear,
          graduation_year: graduationYear,
          coop_cycle: coopCycle,
          concentration: concentration,
          catalog_year: catalogYear,
          courses_transfer: transferCourses.map((course) => {
            return {
              subject: course.subject,
              course_id: course.classId,
              completion: "TRANSFER",
            };
          }),
          courses_completed: coursesCompleted.map((course) => {
            return {
              subject: course.subject,
              course_id: course.classId,
              completion: "PASSED",
            };
          }),
        }
      );

    const createPlanPromise = () => {
      // if (!!coopCycle) {
      //   schedule = generateBlankCompletedCourseSchedule(
      //     academicYear,
      //     graduationYear,
      //     completedCourseSchedule!,
      //     major!,
      //     coopCycle!,
      //     allPlans
      //   );
      // } else {
      const schedule = generateBlankCompletedCourseScheduleNoCoopCycle(
        academicYear,
        graduationYear,
        completedCourseSchedule!
      );
      // }

      return createPlanForUser(userId!, {
        name: "Plan 1",
        link_sharing_enabled: false,
        schedule: schedule,
        major: major,
        coop_cycle: coopCycle,
        concentration: concentration,
        course_counter: completedCourseCounter || 0,
        catalog_year: catalogYear,
      }).then((response) => {
        dispatch(addNewPlanAction(response.plan, academicYear));
        return setPrimaryPlan(userId, response.plan.id);
      });
    };

    return Promise.all([updateUserPromise(), createPlanPromise()]);
  };

  return (
    <OnboardingSelectionTemplate
      screen={3}
      mainTitleText={"Select any exams you took for AP or IB credit:"}
      onSubmit={onSubmit}
      to={"/home"}
    >
      <Grid container justify="space-evenly">
        <Grid key={0} item>
          <Paper
            elevation={0}
            style={{
              width: 350,
            }}
          >
            <MainTitleText>AP Exams</MainTitleText>
            <TransferableExamGroupsComponent
              transferableExamGroups={APExamGroups2020To2021}
              selectedTransferableExams={selectedTransferableExams}
              setSelectedTransferableExams={setSelectedTransferableExams}
              keyPrefix={"ap"}
            />
          </Paper>
        </Grid>
        <Grid key={1} item>
          <Paper
            elevation={0}
            style={{
              width: 350,
            }}
          >
            <MainTitleText>IB Exams</MainTitleText>
            <TransferableExamGroupsComponent
              transferableExamGroups={IBExamGroups2020To2021}
              selectedTransferableExams={selectedTransferableExams}
              setSelectedTransferableExams={setSelectedTransferableExams}
              keyPrefix={"ib"}
            />
          </Paper>
        </Grid>
      </Grid>
    </OnboardingSelectionTemplate>
  );
};

export default TransferableCreditScreen;
