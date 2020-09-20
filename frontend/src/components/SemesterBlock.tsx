import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { ClassBlock } from "./ClassBlocks";
import { AddBlock } from "./ClassBlocks/AddBlock";
import { AddClass, ClassList, EmptyBlock } from ".";
import {
  DNDScheduleTerm,
  CourseWarning,
  DNDScheduleCourse,
  IWarning
} from "../models/types";
import {ScheduleCourse, Status, SeasonWord} from "graduate-common";
import styled from "styled-components";
import { AppState } from "../state/reducers/state";
import { connect } from "react-redux";
import { getCourseWarningsFromState, getWarningsFromState } from "../state";
import { Dispatch } from "redux";
import {
  addClassesAction,
  removeClassAction,
  undoRemoveClassAction,
  changeSemesterStatusAction,
} from "../state/actions/scheduleActions";
import { Snackbar, Button, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Tooltip } from "@material-ui/core";
import { SEMESTER_MIN_HEIGHT } from "../constants";
import { convertTermIdToSeason } from "../utils/schedule-helpers";

const OutsideContainer = styled.div`
  width: 25%;
`;

const Container = styled.div<any>`
  border: 1px solid rgba(235, 87, 87, 0.5);
  box-sizing: border-box;
  position: relative;
  height: 100%;
  background-color: ${props =>
    props.warning ? "rgba(235, 87, 87, 0.6)" : "rgb(255, 255, 255, 0)"};
`;

const ClassListWrapper = styled.div`
  display: flex;
  min-height: ${SEMESTER_MIN_HEIGHT}px;
  flex-direction: column;
  width: 100%;
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
  onUndoDeleteClass: () => void;
  handleStatusChange: (
    newStatus: Status,
    year: number,
    tappedSemester: SeasonWord
  ) => void;
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
  }

  renderTooltip() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {this.props.warnings.map((w, index) => {
          return <span key={index}>{w.message}</span>;
        })}
      </div>
    );
  }

  renderContainer() {
    return (
      <Container warning={this.props.warnings.length > 0}>
        <ClassListWrapper>
          <Droppable droppableId={this.props.semester.termId.toString()}>
            {provided => (
              <ClassList
                innerRef={provided.innerRef as any}
                {...provided.droppableProps}
              >
                {this.renderBody()}
                {provided.placeholder}
                <AddBlock onClick={this.showModal.bind(this)} />
              </ClassList>
            )}
          </Droppable>
        </ClassListWrapper>
      </Container>
    );
  }

  render() {
    const { snackbarOpen, deletedClass, modalVisible } = this.state;
    return (
      <OutsideContainer>
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

        <AddClass
          visible={modalVisible}
          handleClose={this.hideModal.bind(this)}
          handleSubmit={(courses: ScheduleCourse[]) => {
            // Change this semester status upon adding a class if it's not already a CLASSES semester.
            if (this.props.semester.status !== "CLASSES") {
              this.props.handleStatusChange(
                "CLASSES",
                this.props.semester.year,
                convertTermIdToSeason(this.props.semester.termId)!
              );
            }

            // Add the given courses to this semester through redux
            this.props.handleAddClasses(courses, this.props.semester);
          }}
        ></AddClass>
        {this.props.warnings.length > 0 ? (
          <Tooltip title={this.renderTooltip()} placement="top" arrow>
            {this.renderContainer()}
          </Tooltip>
        ) : (
          this.renderContainer()
        )}
      </OutsideContainer>
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
  onUndoDeleteClass: () => dispatch(undoRemoveClassAction()),
  handleStatusChange: (
    newStatus: Status,
    year: number,
    tappedSemester: SeasonWord
  ) => dispatch(changeSemesterStatusAction(newStatus, year, tappedSemester)),
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
