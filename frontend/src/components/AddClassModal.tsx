import React from "react";
import styled from "styled-components";
import { ScheduleCourse } from "../models/types";
import { XButton } from "./common/XButton";
import { fetchCourse } from "../api";
import { Modal } from "@material-ui/core";

const InnerSection = styled.section`
  position: fixed;
  background: white;
  width: 30%;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 12px;
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

const QueuedClass = styled.div`
  border: 1px solid black;
  margin: 4px;
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
}

interface AddClassModalState {
  formSubject: string;
  formClassId: string;
  queuedCourses: ScheduleCourse[];
  errorText?: string;
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
    const courseToAdd = await fetchCourse(formSubject, formClassId);

    if (courseToAdd == null) {
      this.setState({
        errorText:
          "Could not find " + formSubject + formClassId + " in course catalog",
      });
    } else {
      this.setState({
        queuedCourses: [...queuedCourses, courseToAdd],
        errorText: undefined,
      });
    }
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
      <div>
        {!!this.state.errorText && (
          <ErrorTextWrapper>
            <ErrorText>{this.state.errorText}</ErrorText>
          </ErrorTextWrapper>
        )}
        {this.state.queuedCourses.map(
          (course: ScheduleCourse, index: number) => {
            return (
              <QueuedClass>
                <p style={{ width: 80 }}>{course.subject + course.classId}</p>
                <p>{course.name}</p>
                <XButton
                  onClick={this.removeQueuedClass.bind(this, index)}
                ></XButton>
              </QueuedClass>
            );
          }
        )}
      </div>
    );
  }

  prepareToClose() {
    this.setState({
      formSubject: "",
      formClassId: "",
      queuedCourses: [],
      errorText: undefined,
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
                  value={this.state.formSubject}
                  onChange={this.handleSubjectChange.bind(this)}
                ></input>
              </StyledLabel>
              <StyledLabel>
                Class ID:
                <input
                  type="text"
                  value={this.state.formClassId}
                  onChange={this.handleClassIdChange.bind(this)}
                ></input>
              </StyledLabel>
            </FormRow>
          </form>
          <button onClick={this.handleSearch.bind(this)}>Search</button>
          {this.renderQueuedClasses()}
          <button
            onClick={this.handleSubmit.bind(this)}
            disabled={this.state.queuedCourses.length === 0}
          >
            {this.state.queuedCourses.length === 1
              ? "Add Class"
              : "Add Classes"}
          </button>
        </InnerSection>
      </Modal>
    );
  }
}
