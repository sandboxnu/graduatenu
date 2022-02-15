import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../state/reducers/state";
import { IRequiredCourse, Major, ScheduleCourse } from "../../../common/types";
import {
  getCompletedRequirementsFromState,
  getUserMajorFromState,
} from "../state";
import {
  setCompletedCoursesAction,
  setTransferCoursesAction,
} from "../state/actions/studentActions";
import styled from "styled-components";
import { fetchCourse } from "../api";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  ControlledSelectableCourse,
  OnboardingSelectionTemplate,
} from "./GenericOnboarding";
import { Grid, Paper } from "@material-ui/core";
import { AddClassSearchModal } from "../components/AddClassSearchModal";
import { AddBlock } from "../components/ClassBlocks/AddBlock";
import { courseToString, flatten } from "../utils/course-helpers";

const TitleText = styled.div`
  font-size: 12px;
  margin-left: 4px;
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: 500;
`;

type TransferCoursesScreenProps = {
  major: Major;
  completedRequirements: IRequiredCourse[];
  setCompletedCourses: (completedCourses: ScheduleCourse[]) => void;
  setTransferCourses: (transferCourses: ScheduleCourse[]) => void;
} & RouteComponentProps;

const coursesToString = (c: IRequiredCourse[]) =>
  c.map(courseToString).join(",");
const mappableFetchCourse = (c: IRequiredCourse) =>
  fetchCourse(c.subject, String(c.classId));
const fetchAndFilterCourses = async (cs: IRequiredCourse[]) => {
  const courses = await Promise.all(cs.map(mappableFetchCourse));
  // filter will get rid of null values, so cast is safe
  return courses.filter(c => c !== null) as ScheduleCourse[];
};

const courseEq = (c1: IRequiredCourse, c2: IRequiredCourse) =>
  c1.classId === c2.classId && c1.subject === c2.subject;

const TransferCoursesScreenComponent: React.FC<TransferCoursesScreenProps> = () => {
  const major = useSelector((state: AppState) => getUserMajorFromState(state)!);
  const completedRequirements = useSelector((state: AppState) =>
    getCompletedRequirementsFromState(state)
  );
  const dispatch = useDispatch();
  const setCompletedCourses = (completedCourses: ScheduleCourse[]) =>
    dispatch(setCompletedCoursesAction(completedCourses));
  const setTransferCourses = (transferCourses: ScheduleCourse[]) =>
    dispatch(setTransferCoursesAction(transferCourses));

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequirements, setSelectedRequirements] = useState<
    IRequiredCourse[]
  >([]);
  const [otherCourses, setOtherCourses] = useState<IRequiredCourse[][]>([]);
  const [completedNonTransfer] = useState(completedRequirements);

  const addOtherCourses = (courses: ScheduleCourse[]) => {
    let reqCourseMap = courses.map((course: ScheduleCourse) => [
      {
        type: "COURSE",
        classId: +course.classId,
        subject: course.subject,
      } as IRequiredCourse,
    ]);
    setOtherCourses([...otherCourses, ...reqCourseMap]);
  };

  /**
   * Separate transfer and non transfer courses, convert non transfer completed courses
   * into ScheduleCourses, and populate redux store.
   */
  const onSubmit = async () => {
    const filteredCompleted = completedNonTransfer.filter(
      req => !selectedRequirements.some(c => courseEq(c, req))
    );
    const [completed, transfer] = await Promise.all([
      fetchAndFilterCourses(filteredCompleted),
      fetchAndFilterCourses(selectedRequirements),
    ]);
    setCompletedCourses(completed);
    setTransferCourses(transfer);
  };

  /**
   * Renders one course/courseset (if it contains labs/recitiations, and seperated)
   * @param courses - Course pairings to be rendered
   */
  const CourseSet: React.FC<{ courses: IRequiredCourse[] }> = ({ courses }) => {
    const filtered = selectedRequirements.filter(
      r => !courses.some(c => courseEq(r, c))
    );
    return (
      <ControlledSelectableCourse
        checked={filtered.length !== selectedRequirements.length}
        courseText={courses
          .map(({ subject, classId }) => subject + classId)
          .join(" and ")}
        onChange={e =>
          setSelectedRequirements(
            e.target.checked ? [...selectedRequirements, ...courses] : filtered
          )
        }
      />
    );
  };

  /**
   * renders an entire requirement section if it has  classes specified
   * with the title of the section
   * Only classes that have already been selected as a completed course will be rendered
   * @param requirementGroup - the requirement group to be rendered
   */
  const RequirementSection: React.FC<{ requirementGroup: string }> = ({
    requirementGroup,
  }) => {
    const reqs = major.requirementGroupMap[requirementGroup];
    if (!reqs || reqs.type === "RANGE") {
      return null;
    }
    const filteredReqs = flatten(reqs.requirements).filter(req =>
      completedRequirements.some(listReq => courseEq(listReq, req[0]))
    );

    if (filteredReqs.length === 0) return null;
    return (
      <div key={requirementGroup}>
        <TitleText>{requirementGroup}</TitleText>
        {filteredReqs.map(c => (
          <CourseSet courses={c} key={coursesToString(c)} />
        ))}
      </div>
    );
  };

  let renderedMajorReqs = major.requirementGroups
    .map(r => <RequirementSection requirementGroup={r} />)
    .filter(r => r !== null);
  let split = Math.ceil(renderedMajorReqs.length / 2);
  return (
    <OnboardingSelectionTemplate
      screen={2}
      mainTitleText={"Select any courses you took as transfer credit:"}
      onSubmit={onSubmit}
      to={"transferableCredits"}
    >
      <Grid container justify="space-evenly">
        <Grid key={0} item>
          <Paper elevation={0} style={{ minWidth: 350, maxWidth: 400 }}>
            {renderedMajorReqs.slice(0, split)}
          </Paper>
        </Grid>
        <Grid key={1} item>
          <Paper elevation={0} style={{ minWidth: 350, maxWidth: 400 }}>
            <div>
              <TitleText>Other Courses</TitleText>
              <AddBlock onClick={() => setModalVisible(true)} />
              {otherCourses.map(c => (
                <CourseSet courses={c} key={coursesToString(c)} />
              ))}
            </div>
            {renderedMajorReqs.slice(split, renderedMajorReqs.length)}
          </Paper>
        </Grid>
      </Grid>
      <AddClassSearchModal
        visible={modalVisible}
        handleClose={() => setModalVisible(false)}
        handleSubmit={(courses: ScheduleCourse[]) => addOtherCourses(courses)}
      />
    </OnboardingSelectionTemplate>
  );
};

export const TransferCoursesScreen = withRouter(TransferCoursesScreenComponent);
