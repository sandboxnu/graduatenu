import React from "react";
import styled from "styled-components";
import {
  DNDScheduleTerm,
  DNDSchedule,
  DNDScheduleYear,
} from "../../models/types";
import {
  IRequiredCourse,
  ScheduleCourse,
  Status,
  SeasonWord,
} from "../../../../common/types";
import { XButton } from "../common";
import { Modal } from "@material-ui/core";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  addClassesAction,
  changeSemesterStatusAction,
} from "../../state/actions/scheduleActions";
import { getScheduleFromState } from "../../state";
import { AppState } from "../../state/reducers/state";
import { fetchCourse } from "../../api";
import { convertTermIdToSeason } from "../../utils/schedule-helpers";

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
  handleStatusChange: (
    newStatus: Status,
    year: number,
    tappedSemester: SeasonWord
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

  /**
   * Keeps track of the currently selected semester in the form.
   * @param event the change event
   */
  handleSemesterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      formSemester: this.state.semesters[Number(event.target.value)],
    });
  }

  /**
   * Called when the user presses 'add classes'.
   * Adds the designated courses to the selected semester and changes selected semester's status to "CLASSES".
   */
  async handleSubmit() {
    await this.mapRequirementToSchedule();

    this.props.handleAddClasses(
      this.state.queuedCourses,
      this.state.formSemester
    );
    this.props.handleStatusChange(
      "CLASSES",
      this.state.formSemester.year,
      convertTermIdToSeason(this.state.formSemester.termId)
    );
    this.prepareToClose();
  }

  /**
   * Necessary operations to close this modal.
   */
  prepareToClose() {
    this.setState({
      queuedCourses: [],
      formSemester: this.state.semesters[0],
    });
    this.props.handleClose();
  }

  /**
   * Maps each semester from the current DNDSchedule into a list of semesters for use in input.
   */
  mapScheduleToSemesters() {
    let semesterList: DNDScheduleTerm[] = [];
    let schedule: DNDSchedule = this.props.schedule;
    let years: DNDScheduleYear[] = [];
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

  /**
   * Fetches the ScheduleCourse objects of each selected course adds each course to the queuedCourses state.
   */
  async mapRequirementToSchedule() {
    this.setState({
      queuedCourses: [],
    });

    for (let i in this.props.selectedCourses) {
      const courseToAdd: ScheduleCourse | null = await fetchCourse(
        this.props.selectedCourses[i].subject.toUpperCase(),
        this.props.selectedCourses[i].classId.toString()
      );

      if (courseToAdd != null) {
        let curCourses: ScheduleCourse[] = this.state.queuedCourses.slice();
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

/**
 * Callback to be passed into connect, to make the schedule property of AppState available as this component's props.
 * @param state the AppState
 */
const mapStateToProps = (state: AppState) => ({
  schedule: getScheduleFromState(state),
});

/**
 * Callback to be passed into connect, responsible for dispatching redux actions to update the AppState.
 * @param dispatch responsible for dispatching actions to the redux store
 */
const mapDispatchToProps = (dispatch: Dispatch) => ({
  handleAddClasses: (courses: ScheduleCourse[], semester: DNDScheduleTerm) =>
    dispatch(addClassesAction(courses, semester)),
  handleStatusChange: (
    newStatus: Status,
    year: number,
    tappedSemester: SeasonWord
  ) => dispatch(changeSemesterStatusAction(newStatus, year, tappedSemester)),
});

/**
 * Convert this react component into a component that is connected to the redux store.
 * When rendering this connected component, the props assigned in mapStateToProps
 * don't need to be passed down as props from the parent component.
 */
export const SidebarAddClassModal = connect<
  ReduxStoreSidebarAddClassModalProps,
  ReduxDispatchSidebarAddClassModalProps,
  SidebarAddClassModalProps,
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(SidebarAddClassModalComponent);
