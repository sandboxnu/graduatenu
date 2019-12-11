import React from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { DNDScheduleCourse, CourseWarning } from "../../models/types";
import { CLASS_BLOCK_WIDTH, CLASS_BLOCK_HEIGHT } from "../../constants";
import styled from "styled-components";
import { Card, Tooltip } from "@material-ui/core";
import { LargeClassBlock } from "./LargeClassBlock";
import { SmallClassBlock } from "./SmallClassBlock";

const Block = styled(Card)<any>`
  width: ${CLASS_BLOCK_WIDTH}px;
  height: ${props => props.height}px;
  border-radius: 2px;
  margin: 1px;
  display: flex;
  flex-direction: row;
`;

const Indent = styled.div<any>`
  width: 20px;
  background-color: ${props =>
    props.warning ? "rgba(175, 50, 50, 0.9)" : "rgba(173, 198, 255, 0.9)"};
`;

const ClassBlockBody = styled.div<any>`
  background-color: ${props =>
    props.warning ? "rgba(216, 86, 86, 0.9)" : "rgba(173, 198, 255, 0.3)"};
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

  handleMouseHover() {
    this.setState({
      hovering: !this.state.hovering,
    });
  }

  renderBody(provided: DraggableProvided, height: number) {
    const numCredits = this.props.class.numCreditsMax;
    return (
      <div
        onMouseEnter={this.handleMouseHover.bind(this)}
        onMouseLeave={this.handleMouseHover.bind(this)}
      >
        <Block
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          height={height}
        >
          <Indent warning={this.props.warning} />
          <ClassBlockBody warning={this.props.warning}>
            {numCredits > 2 ? (
              <LargeClassBlock
                course={this.props.class}
                hovering={this.state.hovering}
                onDelete={() => this.props.onDelete(this.props.class)}
              />
            ) : (
              <SmallClassBlock
                course={this.props.class}
                hovering={this.state.hovering}
                onDelete={() => this.props.onDelete(this.props.class)}
              />
            )}
          </ClassBlockBody>
        </Block>
      </div>
    );
  }

  render() {
    const numCredits = this.props.class.numCreditsMax;
    var height = CLASS_BLOCK_HEIGHT;

    switch (numCredits) {
      case 0:
        height = CLASS_BLOCK_HEIGHT - 20;
        break;
      case 1:
        height = CLASS_BLOCK_HEIGHT - 20;
        break;
      case 2:
        height = CLASS_BLOCK_HEIGHT - 10;
        break;
      case 3:
        height = CLASS_BLOCK_HEIGHT;
        break;
      case 4:
        height = CLASS_BLOCK_HEIGHT;
        break;
      case 5:
        height = CLASS_BLOCK_HEIGHT + 10;
        break;
    }

    return (
      <Draggable draggableId={this.props.class.dndId} index={this.props.index}>
        {provided =>
          !!this.props.warning ? (
            <Tooltip title={this.props.warning.message} placement="top">
              {this.renderBody(provided, height)}
            </Tooltip>
          ) : (
            this.renderBody(provided, height)
          )
        }
      </Draggable>
    );
  }
}
