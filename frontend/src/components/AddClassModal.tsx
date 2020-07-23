import React from "react";
import styled from "styled-components";
import { DNDSchedule, DNDScheduleTerm } from "../models/types";
import { ScheduleCourse } from "../../../common/types";
import { XButton } from "./common";
import { fetchCourse } from "../api";
import { Modal, CircularProgress } from "@material-ui/core";
import { AppState } from "../state/reducers/state";
import { getScheduleFromState } from "../state";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { withToast } from "../home/toastHook";

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

const SearchButton = styled.button`
  margin: 8px;
`;

const SubmitButton = styled.button`
  margin: 8px;
`;

const QueuedClassesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QueuedClass = styled.div`
  border: 1px solid black;
  margin-top: 4px;
  margin-bottom: 4px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding: 4px;
`;

const ErrorTextWrapper = styled.div`
  display: flex;
  flex: 1;
  margin: 8px;
  flex-direction: row;
  justify-content: center;
`;

const ErrorText = styled.p`
  color: red;
  text-align: center;
`;

interface AddClassModalProps {
  handleClose: () => void;
  handleSubmit: (courses: ScheduleCourse[]) => void;
  visible: boolean;
  schedule: DNDSchedule | undefined;
}

interface AddClassModalState {
  formSubject: string;
  formClassId: string;
  queuedCourses: ScheduleCourse[];
  errorText?: string;
  isLoading: boolean;
}

export class AddClassModal extends React.Component<
  AddClassModalProps,
  AddClassModalState
> {
  constructor(props: AddClassModalProps) {
    super(props);
    this.state = {
      formSubject: "",
      formClassId: "",
      queuedCourses: [],
      errorText: undefined,
      isLoading: false,
    };
  }

  handleSubjectChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ formSubject: event.target.value });
  }

  handleClassIdChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ formClassId: event.target.value });
  }

  async handleSearch() {
    const { formSubject, formClassId, queuedCourses } = this.state;

    this.setState({
      isLoading: true,
    });

    const courseToAdd = await fetchCourse(
      formSubject.toUpperCase(),
      formClassId
    );

    // Make a function to recur down the schedule and determing if courseToAdd is in it
    if (courseToAdd == null) {
      this.setState({
        isLoading: false,
        errorText:
          "Could not find " + formSubject + formClassId + " in course catalog",
      });
    } else if (
      this.props.schedule !== undefined &&
      this.isCourseInSchedule(courseToAdd, this.props.schedule)
    ) {
      this.setState({
        isLoading: false,
        queuedCourses: [...queuedCourses, courseToAdd],
        errorText: courseToAdd.name + " already exists in your schedule",
      });
    } else {
      this.setState({
        isLoading: false,
        queuedCourses: [...queuedCourses, courseToAdd],
        errorText: undefined,
      });
    }
  }

  /**
   *  Determines if this course is in the given schedule
   * @param courseToAdd the course that is being checked
   * @param schedule the schedule being checked
   * @returns whether or not this course is in the schedule
   */
  isCourseInSchedule(courseToAdd: ScheduleCourse, schedule: DNDSchedule) {
    for (let year of schedule.years) {
      if (
        this.isCourseInTerm(courseToAdd, schedule.yearMap[year].spring) ||
        this.isCourseInTerm(courseToAdd, schedule.yearMap[year].fall) ||
        this.isCourseInTerm(courseToAdd, schedule.yearMap[year].summer1) ||
        this.isCourseInTerm(courseToAdd, schedule.yearMap[year].summer2)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   *  Determines if this course is in the given term
   * @param courseToAdd the course that is being checked
   * @param term the term being checked
   * @returns whether or not this course is in the term
   */
  isCourseInTerm(courseToAdd: ScheduleCourse, term: DNDScheduleTerm) {
    for (let course of term.classes) {
      // courseToAdd's classId is an int, so we're casting in order to compare accurately
      if (
        String(courseToAdd.classId) === String(course.classId) &&
        courseToAdd.subject === course.subject
      ) {
        return true;
      }
    }
    return false;
  }

  handleSubmit() {
    this.props.handleSubmit(this.state.queuedCourses);
    this.prepareToClose();
  }

  removeQueuedClass(index: number) {
    const newCourses = this.state.queuedCourses.filter(
      (_, i: number) => i !== index
    );
    this.setState({
      queuedCourses: newCourses,
    });
  }

  renderQueuedClasses() {
    return (
      <QueuedClassesWrapper>
        {!!this.state.errorText && (
          <ErrorTextWrapper>
            <ErrorText>{this.state.errorText}</ErrorText>
          </ErrorTextWrapper>
        )}
        {!!this.state.isLoading && <CircularProgress />}
        {this.state.queuedCourses.map(
          (course: ScheduleCourse, index: number) => {
            return (
              <QueuedClass>
                <p style={{ width: 90 }}>{course.subject + course.classId}</p>
                <p>{course.name}</p>
                <XButton
                  onClick={this.removeQueuedClass.bind(this, index)}
                ></XButton>
              </QueuedClass>
            );
          }
        )}
      </QueuedClassesWrapper>
    );
  }

  prepareToClose() {
    this.setState({
      formSubject: "",
      formClassId: "",
      queuedCourses: [],
      errorText: undefined,
      isLoading: false,
    });
    this.props.handleClose();
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
                Subject:
                <input
                  type="text"
                  placeholder="CS"
                  value={this.state.formSubject}
                  onChange={this.handleSubjectChange.bind(this)}
                ></input>
              </StyledLabel>
              <StyledLabel>
                Class ID:
                <input
                  type="text"
                  placeholder="3500"
                  value={this.state.formClassId}
                  onChange={this.handleClassIdChange.bind(this)}
                ></input>
              </StyledLabel>
            </FormRow>
          </form>
          <SearchButton onClick={this.handleSearch.bind(this)}>
            Search
          </SearchButton>
          {this.renderQueuedClasses()}
          <SubmitButton
            onClick={this.handleSubmit.bind(this)}
            disabled={this.state.queuedCourses.length === 0}
          >
            {this.state.queuedCourses.length === 1
              ? "Add Class"
              : "Add Classes"}
          </SubmitButton>
        </InnerSection>
      </Modal>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  schedule: getScheduleFromState(state),
});

export const AddClass = connect(mapStateToProps)(
  withRouter(withToast(AddClassModal))
);
