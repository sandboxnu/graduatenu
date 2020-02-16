import React from "react";
import styled from "styled-components";
import {
  ScheduleCourse,
  DNDScheduleTerm,
  DNDSchedule,
  IRequiredCourse,
} from "../../models/types";
import { XButton } from "../common";
import { Modal } from "@material-ui/core";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { addClassesAction } from "../../state/actions/scheduleActions";
import { getScheduleFromState } from "../../state";
import { AppState } from "../../state/reducers/state";
import { fetchCourse } from "../../api";

const InnerSection = styled.section`
  position: fixed;
  background: white;
  width: 30%;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseButtonWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 18px;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const SubmitButton = styled.button`
  margin: 8px;
`;

interface ReduxStoreSidebarAddClassModalProps {
  schedule: DNDSchedule;
}

interface ReduxDispatchSidebarAddClassModalProps {
  handleAddClasses: (
    courses: ScheduleCourse[],
    semester: DNDScheduleTerm
  ) => void;
}

interface SidebarAddClassModalProps {
  handleClose: () => void;
  handleSubmit: (courses: ScheduleCourse[]) => void;
  visible: boolean;
  selectedCourses: IRequiredCourse[];
}

type Props = SidebarAddClassModalProps &
  ReduxStoreSidebarAddClassModalProps &
  ReduxDispatchSidebarAddClassModalProps;

interface SidebarAddClassModalState {
  queuedCourses: ScheduleCourse[];
  formSemester: DNDScheduleTerm;
  semesters: DNDScheduleTerm[];
  courses: ScheduleCourse[];
}

export class SidebarAddClassModalComponent extends React.Component<
  Props,
  SidebarAddClassModalState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      queuedCourses: [],
      formSemester: {
        season: "FL",
        year: 0,
        termId: 0,
        id: 0,
        status: "INACTIVE",
        classes: [],
      },
      semesters: [],
      courses: [],
    };
  }

  componentDidMount() {
    this.mapScheduleToSemesters();
  }

  handleSemesterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      formSemester: this.state.semesters[Number(event.target.value)],
    });
  }

  async handleSubmit() {
    await this.mapRequirementToSchedule();

    this.props.handleAddClasses(
      this.state.queuedCourses,
      this.state.formSemester
    );
    this.prepareToClose();
  }

  prepareToClose() {
    this.setState({
      queuedCourses: [],
    });
    this.props.handleClose();
  }

  mapScheduleToSemesters() {
    let semesterList = [];
    let schedule = this.props.schedule;
    let years = [];
    for (let i of schedule.years) {
      years.push(schedule.yearMap[i]);
    }

    for (let i in years) {
      semesterList.push(years[i].fall);
      semesterList.push(years[i].spring);
      semesterList.push(years[i].summer1);
      semesterList.push(years[i].summer2);
    }

    this.setState({
      semesters: semesterList,
      formSemester: semesterList[0],
    });
  }

  async mapRequirementToSchedule() {
    this.setState({
      queuedCourses: [],
    });

    for (let i in this.props.selectedCourses) {
      const courseToAdd = await fetchCourse(
        this.props.selectedCourses[i].subject.toUpperCase(),
        this.props.selectedCourses[i].classId.toString()
      );

      if (courseToAdd != null) {
        let curCourses = this.state.queuedCourses.slice();
        curCourses.push(courseToAdd);
        this.setState({
          queuedCourses: curCourses,
        });
      }
    }
  }

  render() {
    const { visible } = this.props;

    return (
      <Modal
        style={{ outline: 0 }}
        open={visible}
        onClose={this.prepareToClose.bind(this)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <InnerSection>
          <CloseButtonWrapper>
            <XButton onClick={this.prepareToClose.bind(this)}></XButton>
          </CloseButtonWrapper>
          <h1 id="simple-modal-title">Add classes</h1>
          <form>
            <FormRow>
              <StyledLabel>
                Semester:
                <select
                  defaultValue={0}
                  onChange={this.handleSemesterChange.bind(this)}
                >
                  {this.state.semesters.map(function(sem, index) {
                    let curSeason, curYear;
                    switch (sem.season) {
                      case "FL":
                        curSeason = "Fall";
                        curYear = sem.year;
                        break;
                      case "SP":
                        curSeason = "Spring";
                        curYear = sem.year + 1;
                        break;
                      case "S1":
                        curSeason = "Summer 1";
                        curYear = sem.year + 1;
                        break;
                      case "S2":
                        curSeason = "Summer 2";
                        curYear = sem.year + 1;
                        break;
                      default:
                        curSeason = sem.season;
                        curYear = sem.year;
                    }

                    return (
                      <option
                        key={sem.id}
                        value={index}
                      >{`${curSeason} ${curYear}`}</option>
                    );
                  })}
                </select>
              </StyledLabel>
            </FormRow>
          </form>
          <SubmitButton onClick={this.handleSubmit.bind(this)}>
            Add Class
          </SubmitButton>
        </InnerSection>
      </Modal>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  schedule: getScheduleFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  handleAddClasses: (courses: ScheduleCourse[], semester: DNDScheduleTerm) =>
    dispatch(addClassesAction(courses, semester)),
});

export const SidebarAddClassModal = connect<
  ReduxStoreSidebarAddClassModalProps,
  ReduxDispatchSidebarAddClassModalProps,
  SidebarAddClassModalProps,
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(SidebarAddClassModalComponent);
