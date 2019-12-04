import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { DNDScheduleCourse } from "../../models/types";
import { CLASS_BLOCK_WIDTH, CLASS_BLOCK_HEIGHT } from "../../constants";
import styled from "styled-components";
import { Card } from "@material-ui/core";
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

const Indent = styled.div`
  width: 20px;
  background-color: rgba(173, 198, 255, 0.9);
`;

const ClassBlockBody = styled.div`
  background-color: rgba(173, 198, 255, 0.3);
  padding-left: 8px;
  flex: 1;
`;

interface ClassBlockProps {
  class: DNDScheduleCourse;
  index: number;
}

export class ClassBlock extends React.Component<ClassBlockProps> {
  render() {
    const numCredits = this.props.class.numCreditsMax;
    var height = CLASS_BLOCK_HEIGHT;

    switch (numCredits) {
      case 0:
        height = CLASS_BLOCK_HEIGHT - 30;
        break;
      case 1:
        height = CLASS_BLOCK_HEIGHT - 30;
        break;
      case 2:
        height = CLASS_BLOCK_HEIGHT - 20;
        break;
      case 3:
        height = CLASS_BLOCK_HEIGHT - 10;
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
        {provided => (
          <Block
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            height={height}
          >
            <Indent />
            <ClassBlockBody>
              {numCredits > 2 ? (
                <LargeClassBlock course={this.props.class} />
              ) : (
                <SmallClassBlock course={this.props.class} />
              )}
            </ClassBlockBody>
          </Block>
        )}
      </Draggable>
    );
  }
}
