import React from "react";
import styled from "styled-components";
import { ScheduleCourse } from "../models/types";
import { XButton } from "./common/XButton";
import { fetchCourse } from "../api";

const ShowWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: block;
`;

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

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
`;

const FormRow = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row:
    justify-content: space-around
`;

const QueuedClass = styled.div`
    border: 1px solid black
    margin: 12px;
    display: flex;
    flex-direction: row;
`;

interface AddClassModalProps {
  handleClose: () => void;
  visible: boolean;
}

interface AddClassModalState {
  formSubject: string;
  formClassId: string;
  queuedCourses: ScheduleCourse[];
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
    };
  }

  handleSubjectChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ formSubject: event.target.value });
  }

  handleClassIdChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ formClassId: event.target.value });
  }

  async handleSearch() {
    const courseToAdd = await fetchCourse(
      this.state.formSubject,
      this.state.formClassId
    );

    this.setState({
      queuedCourses: [...this.state.queuedCourses, courseToAdd],
    });
  }

  removeQueuedClass(index: number) {
    const newCourses = this.state.queuedCourses.filter(
      (course: ScheduleCourse, i: number) => i !== index
    );
    this.setState({
      queuedCourses: newCourses,
    });
  }

  renderQueuedClasses() {
    return (
      <div>
        {this.state.queuedCourses.map(
          (course: ScheduleCourse, index: number) => {
            return (
              <QueuedClass>
                <p>{course.subject + course.classId + " " + course.name}</p>
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

  render() {
    const { visible, handleClose } = this.props;
    return visible ? (
      <ShowWrapper>
        <InnerSection>
          <h1>Add classes</h1>
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
          <button onClick={handleClose}>Close</button>
        </InnerSection>
      </ShowWrapper>
    ) : (
      <div></div>
    );
  }
}
