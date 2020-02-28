import React from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { DNDScheduleCourse, CourseWarning } from "../../models/types";
import styled from "styled-components";
import { Card, Tooltip } from "@material-ui/core";
import { ClassBlockBody } from "./ClassBlockBody";

const Block = styled(Card)<any>`
  height: 30px;
  border-radius: 2px;
  margin: 10px 8px 0px 8px;
  display: flex;
  flex-direction: row;
`;

const ClassBlockBodyContainer = styled.div<any>`
  background-color: #c4c4c4;
  padding-left: 8px;
  flex: 1;
`;

interface ClassBlockProps {
  class: DNDScheduleCourse;
  index: number;
  warning?: CourseWarning;
  onDelete: (course: DNDScheduleCourse) => void;
}

interface ClassBlockState {
  hovering: boolean;
}

export class ClassBlock extends React.Component<
  ClassBlockProps,
  ClassBlockState
> {
  constructor(props: ClassBlockProps) {
    super(props);

    this.state = {
      hovering: false,
    };
  }

  handleMouseEnter() {
    this.setState({
      hovering: true,
    });
  }

  handleMouseLeave() {
    this.setState({
      hovering: false,
    });
  }

  renderBody(provided: DraggableProvided) {
    return (
      <div
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
      >
        <Block
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <ClassBlockBodyContainer warning={this.props.warning}>
            <ClassBlockBody
              course={this.props.class}
              hovering={this.state.hovering}
              onDelete={() => this.props.onDelete(this.props.class)}
            />
          </ClassBlockBodyContainer>
        </Block>
      </div>
    );
  }

  render() {
    return (
      <Draggable draggableId={this.props.class.dndId} index={this.props.index}>
        {provided =>
          !!this.props.warning ? (
            <Tooltip title={this.props.warning.message} placement="top">
              {this.renderBody(provided)}
            </Tooltip>
          ) : (
            this.renderBody(provided)
          )
        }
      </Draggable>
    );
  }
}
