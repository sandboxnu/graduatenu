import * as React from "react";
import styled from "styled-components";
import { DNDScheduleCourse } from "../models/types";
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@material-ui/icons/ExpandLessOutlined";
import { connect } from "react-redux";
import { AppState } from "../state/reducers/state";
import { getCompletedCoursesFromState } from "../state";
import {
  sumCreditsFromList,
  getStandingFromCompletedCourses,
  COMPLETED_COURSES_AREA_DROPPABLE_ID,
  getNumberOfCompletedCourses,
} from "../utils";
import { Droppable } from "react-beautiful-dnd";
import { EmptyBlock } from ".";
import { ClassBlock } from "./ClassBlocks";
import { Dispatch } from "redux";
import { removeCompletedCoursesAction } from "../state/actions/scheduleActions";
import { SEMESTER_MIN_HEIGHT, CLASS_BLOCK_WIDTH } from "../constants";
import { ICompletedCoursesMap } from "../state/reducers/scheduleReducer";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopInfo = styled.div`
  display: flex;
  height: 70px;
  background-color: #fafafa;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const BottomInfo = styled.div`
  display: flex;
  flex-direction: row;
  min-height: ${SEMESTER_MIN_HEIGHT}px;
  background-color: #fafafa;
  border: 2px solid lightgrey;
`;

const ListWrapper = styled.div<any>`
  display: flex;
  min-height: ${SEMESTER_MIN_HEIGHT}px;
  flex-direction: column;
  width: ${CLASS_BLOCK_WIDTH + 4}px;
  height: 100%;
`;

interface IDropDownModalProps {
  completedCourses: ICompletedCoursesMap;
  onDeleteClass: (course: DNDScheduleCourse) => void;
}

interface IDropDownModalState {
  expanded: boolean;
}

class DropDownModalComponent extends React.Component<
  IDropDownModalProps,
  IDropDownModalState
> {
  constructor(props: IDropDownModalProps) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  handleClick() {
    this.setState({ expanded: !this.state.expanded });
  }

  renderListOfClasses(courses: DNDScheduleCourse[]) {
    return courses.map((scheduleCourse, index) => {
      if (!!scheduleCourse) {
        return (
          <ClassBlock
            key={index}
            class={scheduleCourse}
            index={index}
            onDelete={() => this.props.onDeleteClass(scheduleCourse)}
          />
        );
      }
      return <EmptyBlock key={index} />;
    });
  }

  renderSections() {
    return [0, 1, 2, 3].map(v => (
      <Droppable droppableId={COMPLETED_COURSES_AREA_DROPPABLE_ID + "-" + v}>
        {provided => (
          <ListWrapper {...provided.droppableProps} ref={provided.innerRef}>
            {this.renderListOfClasses(this.props.completedCourses[v])}
            {provided.placeholder}
          </ListWrapper>
        )}
      </Droppable>
    ));
  }

  render() {
    const { completedCourses } = this.props;
    return (
      <Wrapper>
        <TopInfo onClick={this.handleClick.bind(this)}>
          <p>{getNumberOfCompletedCourses(completedCourses)} courses</p>
          <p>{sumCreditsFromList(completedCourses)} credits</p>
          <p>{getStandingFromCompletedCourses(completedCourses)} Standing</p>
          {this.state.expanded ? (
            <ExpandLessOutlinedIcon />
          ) : (
            <ExpandMoreOutlinedIcon />
          )}
        </TopInfo>
        {this.state.expanded && (
          <BottomInfo>{this.renderSections()}</BottomInfo>
        )}
      </Wrapper>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  completedCourses: getCompletedCoursesFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onDeleteClass: (course: DNDScheduleCourse) =>
    dispatch(removeCompletedCoursesAction(course)),
});

export const DropDownModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(DropDownModalComponent);
