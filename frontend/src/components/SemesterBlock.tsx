import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { ClassBlock } from "./ClassBlocks";
import { AddBlock } from "./ClassBlocks/AddBlock";
import { AddClass, ClassList, EmptyBlock } from ".";
import {
  DNDScheduleTerm,
  CourseWarning,
  DNDScheduleCourse,
  IWarning,
} from "../models/types";
import { ScheduleCourse, Status, SeasonWord } from "../../../common/types";
import styled from "styled-components";
import { AppState } from "../state/reducers/state";
import { connect } from "react-redux";
import {
  getCourseWarningsFromState,
  getCurrentClassCounterFromState,
  getWarningsFromState,
} from "../state";
import { Dispatch } from "redux";
import {
  addCoursesToActivePlanAction,
  removeClassFromActivePlanAction,
  undoRemoveClassFromActivePlanAction,
  changeSemesterStatusForActivePlanAction,
} from "../state/actions/userPlansActions";
import { Tooltip } from "@material-ui/core";
import { SEMESTER_MIN_HEIGHT } from "../constants";
import { convertTermIdToSeason } from "../utils/schedule-helpers";
import { UndoDelete } from "./UndoDelete";

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
  currentClassCounter: number;
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

  closeSnackBar = () => {
    this.setState({
      snackbarOpen: false,
    });
  };

  /**
   * Filters through the given list of course warnings to find all warnings for the given course
   * @param courseWarnings the list of course warnings to search through
   * @param course the search course
   */
  findCourseWarnings(
    courseWarnings: CourseWarning[],
    course: DNDScheduleCourse
  ) {
    const result: CourseWarning[] = courseWarnings.filter(
      w => w.subject + w.classId === course.subject + course.classId
    );

    if (result.length === 0) {
      return undefined;
    } else {
      return result;
    }
  }

  renderBody() {
    const { semester, courseWarnings } = this.props;
    const status = semester.status;
    if (
      status === "CLASSES" ||
      status === "HOVERINACTIVE" ||
      status === "COOP"
    ) {
      return semester.classes.map((scheduleCourse, index) => {
        if (!!scheduleCourse) {
          return (
            <ClassBlock
              key={index}
              class={scheduleCourse}
              index={index}
              warnings={this.findCourseWarnings(courseWarnings, scheduleCourse)}
              onDelete={this.onDeleteClass.bind(this, scheduleCourse, semester)}
              currentClassCounter={this.props.currentClassCounter}
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
        <UndoDelete
          deletedClass={deletedClass}
          snackbarOpen={snackbarOpen}
          handleSnackbarClose={this.handleSnackbarClose.bind(this)}
          undoButtonPressed={this.undoButtonPressed.bind(this)}
          closeSnackBar={this.closeSnackBar.bind(this)}
        />

        <AddClass
          visible={modalVisible}
          handleClose={this.hideModal.bind(this)}
          handleSubmit={(courses: ScheduleCourse[]) => {
            // Change this semester status upon adding a class if it's not already a CLASSES semester.
            if (
              this.props.semester.status !== "CLASSES" &&
              this.props.semester.status !== "COOP"
            ) {
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
  currentClassCounter: getCurrentClassCounterFromState(state)!,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  handleAddClasses: (courses: ScheduleCourse[], semester: DNDScheduleTerm) =>
    dispatch(addCoursesToActivePlanAction(courses, semester)),
  onDeleteClass: (course: DNDScheduleCourse, semester: DNDScheduleTerm) =>
    dispatch(removeClassFromActivePlanAction(course, semester)),
  onUndoDeleteClass: () => dispatch(undoRemoveClassFromActivePlanAction()),
  handleStatusChange: (
    newStatus: Status,
    year: number,
    tappedSemester: SeasonWord
  ) =>
    dispatch(
      changeSemesterStatusForActivePlanAction(newStatus, year, tappedSemester)
    ),
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
