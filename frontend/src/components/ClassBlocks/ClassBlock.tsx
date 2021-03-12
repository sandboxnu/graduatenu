import React from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { DNDScheduleCourse, CourseWarning } from "../../models/types";
import styled from "styled-components";
import { Card, Tooltip } from "@material-ui/core";
import { ClassBlockBody } from "./ClassBlockBody";

const Block = styled(Card)<any>`
  height: 30px;
  border-radius: 4px;
  margin: 10px 8px 0px 8px;
  display: flex;
  flex-direction: row;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15);
`;

const ClassBlockBodyContainer = styled.div<any>`
  background-color: ${props => (props.warning ? "#F8CECE" : "#E0E0E0")};
  padding-left: 8px;
  flex: 1;
  min-width: 0;
`;

interface ClassBlockProps {
  class: DNDScheduleCourse;
  lab?: DNDScheduleCourse;
  index: number;
  warnings?: CourseWarning[];
  onDelete: (course: DNDScheduleCourse) => void;
  currentClassCounter: number;
  canEditBlockName: boolean;
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
          <ClassBlockBodyContainer warning={this.props.warnings}>
            <ClassBlockBody
              course={this.props.class}
              hovering={this.state.hovering}
              onDelete={() => this.props.onDelete(this.props.class)}
              canEditBlockName={this.props.canEditBlockName}
            />
          </ClassBlockBodyContainer>
        </Block>
      </div>
    );
  }

  /**
   * Returns this ClassBlock's draggableId based on whether or not it contains a lab.
   */
  getDraggableId() {
    if (this.props.lab) {
      return this.props.class.dndId + " " + this.props.lab.dndId;
    } else {
      return this.props.class.dndId;
    }
  }

  /**
   * Returns this ClassBlock's Tooltip title node corresponding to its warnings.
   */
  getTooltipTitle() {
    if (this.props.warnings) {
      return (
        <div>
          {this.props.warnings.map(warning => (
            <div>{warning.message}</div>
          ))}
        </div>
      );
    } else {
      return "";
    }
  }

  render() {
    return (
      <Draggable draggableId={this.getDraggableId()} index={this.props.index}>
        {provided =>
          !!this.props.warnings ? (
            <Tooltip title={this.getTooltipTitle()} placement="bottom">
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
