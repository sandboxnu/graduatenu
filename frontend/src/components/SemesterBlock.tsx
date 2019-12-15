import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { ClassBlock } from "./ClassBlocks";
import { AddClassModal, ClassList, EmptyBlock } from ".";
import {
  DNDScheduleTerm,
  ScheduleCourse,
  CourseWarning,
  DNDScheduleCourse,
} from "../models/types";
import { AddButton } from "./Year";
import styled from "styled-components";
import { AppState } from "../state/reducers/state";
import { connect } from "react-redux";
import { getCourseWarningsFromState } from "../state";
import { Dispatch } from "redux";
import {
  addClassesAction,
  removeClassAction,
  undoRemoveClassAction,
} from "../state/actions/scheduleActions";
import { Snackbar, Button, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const Container = styled.div`
  border: 1px solid black;
  position: relative;
  height: 100%;
`;

const AddButtonContainer = styled.div`
	position: absolute;
	right: 6px
	bottom: 6px
	zIndex: 1
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
}

interface ReduxDispatchSemesterBlockProps {
  handleAddClasses: (
    courses: ScheduleCourse[],
    semester: DNDScheduleTerm
  ) => void;
  onDeleteClass: (course: DNDScheduleCourse, semester: DNDScheduleTerm) => void;
  onUndoDeleteClass: () => void;
}

interface SemesterBlockProps {
  semester: DNDScheduleTerm;
}

type Props = SemesterBlockProps &
  ReduxStoreSemesterBlockProps &
  ReduxDispatchSemesterBlockProps;

interface SemesterBlockState {
  modalVisible: boolean;
  snackbarOpen: boolean;
  deletedClass?: DNDScheduleCourse;
}

class SemesterBlockComponent extends React.Component<
  Props,
  SemesterBlockState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalVisible: false,
      snackbarOpen: false,
      deletedClass: undefined,
    };
  }

  showModal() {
    this.setState({ modalVisible: true });
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  openSnackbar = () => {
    this.setState({
      snackbarOpen: true,
    });
  };

  handleSnackbarClose = (
    event: React.SyntheticEvent<any, Event>,
    reason: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({
      snackbarOpen: false,
    });
  };

  onDeleteClass = (course: DNDScheduleCourse, semester: DNDScheduleTerm) => {
    this.setState(
      {
        snackbarOpen: true,
        deletedClass: course,
      },
      () => this.props.onDeleteClass(course, semester)
    );
  };

  undoButtonPressed = () => {
    this.setState(
      {
        snackbarOpen: false,
      },
      this.props.onUndoDeleteClass
    );
  };

  renderBody() {
    const { semester, courseWarnings } = this.props;
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
              onDelete={this.onDeleteClass.bind(this, scheduleCourse, semester)}
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

  render() {
    const { snackbarOpen, deletedClass, modalVisible } = this.state;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={snackbarOpen}
          onClose={this.handleSnackbarClose.bind(this)}
          autoHideDuration={5000}
          message={
            <span>
              {!!deletedClass
                ? "Removed " +
                  deletedClass.subject +
                  deletedClass.classId +
                  ": " +
                  deletedClass.name
                : "Removed Class"}
            </span>
          }
          action={[
            <Button
              key="undo"
              color="secondary"
              size="small"
              onClick={this.undoButtonPressed.bind(this)}
            >
              UNDO
            </Button>,
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={() =>
                this.setState({
                  snackbarOpen: false,
                })
              }
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />

        <AddClassModal
          visible={modalVisible}
          handleClose={this.hideModal.bind(this)}
          handleSubmit={(courses: ScheduleCourse[]) =>
            this.props.handleAddClasses(courses, this.props.semester)
          }
        ></AddClassModal>

        <Container>
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
      </div>
    );
  }
}

const mapStateToProps = (state: AppState, ownProps: SemesterBlockProps) => ({
  courseWarnings: getCourseWarningsFromState(state, ownProps.semester),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  handleAddClasses: (courses: ScheduleCourse[], semester: DNDScheduleTerm) =>
    dispatch(addClassesAction(courses, semester)),
  onDeleteClass: (course: DNDScheduleCourse, semester: DNDScheduleTerm) =>
    dispatch(removeClassAction(course, semester)),
  onUndoDeleteClass: () => dispatch(undoRemoveClassAction()),
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
