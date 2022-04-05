import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import {
  APExamGroups2020To2021,
  courseEq,
  courseToString,
  IBExamGroups2020To2021,
  ScheduleCourse,
  TransferableExamGroup,
} from "@graduate/common";
import { AddClassSearchModal } from "./AddClassSearchModal";
import {
  addTransferClassAction,
  removeTransferClassAction,
} from "../state/actions/studentActions";
import { AddBlock } from "./ClassBlocks/AddBlock";
import { NonDraggableClassBlock } from "./ClassBlocks/NonDraggableClassBlock";
import { Tooltip } from "@material-ui/core";
import { UndoDelete } from "./UndoDelete";

interface TransferCreditsProps {
  transferCredits: ScheduleCourse[];
  isEditable: boolean;
}

interface TransferCreditsState {
  modalVisible: boolean;
  snackbarOpen: boolean;
  deletedClass?: ScheduleCourse;
}

interface ReduxDispatchTransferCreditsProps {
  handleAddClasses: (courses: ScheduleCourse[]) => void;
  onDeleteClass: (course: ScheduleCourse) => void;
}

type Props = TransferCreditsProps & ReduxDispatchTransferCreditsProps;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  background-color: #eb5757;
  width: 100%;
  padding: 0px;
`;

const Text = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: white;
`;

const HolderBody = styled.div<any>`
  border: 1px solid rgba(235, 87, 87, 0.5);
  box-sizing: border-box;
  position: relative;
  height: 100%;
  min-height: 30px;
  background-color: "rgb(255, 255, 255, 0)";
`;

const ClassWrapper = styled.div`
  width: 25%;
  height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`;

/**
 * Determines the corresponding transferable exam type and name for the given NEU course.
 * @param examGroups The transferable exam groupings (either AP or IB).
 * @param course The NEU course to query against.
 * @returns The exam type and name as a string.
 */
function findExamText(
  examGroups: TransferableExamGroup[],
  course: ScheduleCourse
): string {
  for (const examGroup of examGroups) {
    for (const transferableExam of examGroup.transferableExams) {
      for (const mappableCourse of transferableExam.mappableCourses) {
        if (courseEq(mappableCourse, course)) {
          return `${transferableExam.type} ${transferableExam.name}`;
        }
      }
    }
  }
  // If not found, return an empty string.
  return "";
}

/**
 * Gets the tooltip hover text for the transfer credits container.
 * @param course The NEU course to query against.
 * @returns The tooltip hover text as a string.
 */
function getTooltipText(course: ScheduleCourse) {
  const apExamText = findExamText(APExamGroups2020To2021, course);
  const ibExamText = findExamText(IBExamGroups2020To2021, course);

  if (apExamText === "" && ibExamText === "") {
    return `Transferred as ${course.subject} ${course.classId}`;
  } else if (apExamText === "") {
    return `Fulfilled by ${ibExamText}`;
  } else if (ibExamText === "") {
    return `Fulfilled by ${apExamText}`;
  }

  return `Fulfilled by ${apExamText} or ${ibExamText}`;
}

function renderTooltip(course: ScheduleCourse) {
  const tooltipText = getTooltipText(course);

  return <div>{tooltipText}</div>;
}

class TransferCreditsComponent extends React.Component<
  Props,
  TransferCreditsState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalVisible: false,
      snackbarOpen: false,
      deletedClass: undefined,
    };
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  showModal() {
    this.setState({ modalVisible: true });
  }

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

  onDeleteClass = (course: ScheduleCourse) => {
    this.setState(
      {
        snackbarOpen: true,
        deletedClass: course,
      },
      () => this.props.onDeleteClass(course)
    );
  };

  undoButtonPressed = () => {
    this.setState({
      snackbarOpen: false,
    });
  };

  closeSnackBar = () => {
    this.setState({
      snackbarOpen: false,
    });
  };

  // individual courses
  renderTransferCourses() {
    if (this.props.transferCredits == null) {
      return null;
    }
    return this.props.transferCredits.map((scheduleCourse) => {
      if (!!scheduleCourse) {
        return (
          <Tooltip title={renderTooltip(scheduleCourse)} placement="top">
            <ClassWrapper key={courseToString(scheduleCourse)}>
              <NonDraggableClassBlock
                course={scheduleCourse}
                onDelete={this.onDeleteClass.bind(this, scheduleCourse)}
                hideDelete={!this.props.isEditable}
              />
            </ClassWrapper>
          </Tooltip>
        );
      }
      return null;
    });
  }

  renderContainer() {
    return <Wrapper>{this.renderTransferCourses()}</Wrapper>;
  }

  render() {
    const { modalVisible, deletedClass, snackbarOpen } = this.state;
    return (
      <div style={{ width: "100%", marginBottom: 28 }}>
        <Container>
          <div>
            <Text>Transfer Credits</Text>
          </div>
        </Container>
        <HolderBody>
          {this.props.isEditable && (
            <UndoDelete
              deletedClass={deletedClass}
              snackbarOpen={snackbarOpen}
              handleSnackbarClose={this.handleSnackbarClose.bind(this)}
              undoButtonPressed={this.undoButtonPressed.bind(this)}
              closeSnackBar={this.closeSnackBar.bind(this)}
            />
          )}
          {this.renderContainer()}
          {this.props.isEditable && (
            <>
              <AddBlock onClick={this.showModal.bind(this)} />
              <AddClassSearchModal
                visible={modalVisible}
                handleClose={this.hideModal.bind(this)}
                handleSubmit={(courses: ScheduleCourse[]) => {
                  // Add the given courses through redux
                  this.props.handleAddClasses(courses);
                }}
              />
            </>
          )}
        </HolderBody>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  handleAddClasses: (courses: ScheduleCourse[]) =>
    dispatch(addTransferClassAction(courses)),
  onDeleteClass: (course: ScheduleCourse) =>
    dispatch(removeTransferClassAction(course)),
});

export const TransferCredits = connect(
  null,
  mapDispatchToProps
)(TransferCreditsComponent);
