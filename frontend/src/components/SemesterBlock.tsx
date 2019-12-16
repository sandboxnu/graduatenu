import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { ClassBlock } from "./ClassBlocks";
import { AddClassModal, ClassList, EmptyBlock } from ".";
import {
  DNDScheduleTerm,
  ScheduleCourse,
  CourseWarning,
  DNDScheduleCourse,
  IWarning,
} from "../models/types";
import { AddButton } from "./Year";
import styled from "styled-components";
import { AppState } from "../state/reducers/state";
import { connect } from "react-redux";
import { getCourseWarningsFromState, getWarningsFromState } from "../state";
import { Dispatch } from "redux";
import {
  addClassesAction,
  removeClassAction,
} from "../state/actions/scheduleActions";
import { Tooltip } from "@material-ui/core";

const Container = styled.div<any>`
  border: 1px solid black;
  position: relative;
  height: 100%;
  background-color: ${props =>
    props.warning ? "rgba(216, 86, 86, 0.9)" : "rgb(255, 255, 255, 0)"};
`;

const AddButtonContainer = styled.div`
	position: absolute;
	right: 6px
	bottom: 6px
	z-index: 1;
`;

const NoClassBlock = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: grey;
  height: 100%;
`;

interface ReduxStoreSemesterBlockProps {
  courseWarnings: CourseWarning[];
  warnings: IWarning[];
}

interface ReduxDispatchSemesterBlockProps {
  handleAddClasses: (
    courses: ScheduleCourse[],
    semester: DNDScheduleTerm
  ) => void;
  onDeleteClass: (course: DNDScheduleCourse, semester: DNDScheduleTerm) => void;
}

interface SemesterBlockProps {
  semester: DNDScheduleTerm;
}

type Props = SemesterBlockProps &
  ReduxStoreSemesterBlockProps &
  ReduxDispatchSemesterBlockProps;

interface SemesterBlockState {
  modalVisible: boolean;
}

class SemesterBlockComponent extends React.Component<
  Props,
  SemesterBlockState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  showModal() {
    this.setState({ modalVisible: true });
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  renderBody() {
    const { semester, courseWarnings, onDeleteClass } = this.props;
    const status = semester.status;
    if (status === "CLASSES" || status === "HOVERINACTIVE") {
      return semester.classes.map((scheduleCourse, index) => {
        if (!!scheduleCourse) {
          return (
            <ClassBlock
              key={index}
              class={scheduleCourse}
              index={index}
              warning={courseWarnings.find(
                w =>
                  w.subject + w.classId ===
                  scheduleCourse.subject + scheduleCourse.classId
              )}
              onDelete={() => onDeleteClass(scheduleCourse, semester)}
            />
          );
        }
        return <EmptyBlock key={index} />;
      });
    }

    if (status === "COOP") {
      return (
        <NoClassBlock>
          <p>CO-OP</p>
        </NoClassBlock>
      );
    }

    if (status === "INACTIVE") {
      return (
        <NoClassBlock>
          <p>VACATION</p>
        </NoClassBlock>
      );
    }
  }

  renderTooltip() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {this.props.warnings.map(w => {
          return <span>{w.message}</span>;
        })}
      </div>
    );
  }

  renderContainer() {
    return (
      <Container warning={this.props.warnings.length > 0}>
        <Droppable droppableId={this.props.semester.termId.toString()}>
          {provided => (
            <ClassList
              innerRef={provided.innerRef as any}
              {...provided.droppableProps}
            >
              {this.renderBody()}
              {provided.placeholder}
            </ClassList>
          )}
        </Droppable>
        <AddButtonContainer>
          <AddButton onClick={this.showModal.bind(this)}></AddButton>
        </AddButtonContainer>
      </Container>
    );
  }

  render() {
    return (
      <div>
        <AddClassModal
          visible={this.state.modalVisible}
          handleClose={this.hideModal.bind(this)}
          handleSubmit={(courses: ScheduleCourse[]) =>
            this.props.handleAddClasses(courses, this.props.semester)
          }
        ></AddClassModal>
        {this.props.warnings.length > 0 ? (
          <Tooltip title={this.renderTooltip()} placement="top" arrow>
            {this.renderContainer()}
          </Tooltip>
        ) : (
          this.renderContainer()
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, ownProps: SemesterBlockProps) => ({
  warnings: getWarningsFromState(state).filter(
    w => w.termId === ownProps.semester.termId
  ),
  courseWarnings: getCourseWarningsFromState(state, ownProps.semester),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  handleAddClasses: (courses: ScheduleCourse[], semester: DNDScheduleTerm) =>
    dispatch(addClassesAction(courses, semester)),
  onDeleteClass: (course: DNDScheduleCourse, semester: DNDScheduleTerm) =>
    dispatch(removeClassAction(course, semester)),
});

export const SemesterBlock = connect<
  ReduxStoreSemesterBlockProps,
  ReduxDispatchSemesterBlockProps,
  SemesterBlockProps,
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(SemesterBlockComponent);
