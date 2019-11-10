import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { DNDScheduleCourse } from "../models/types";
import { CLASS_BLOCK_WIDTH, CLASS_BLOCK_HEIGHT } from "../constants";
import styled from "styled-components";
import { Card } from "@material-ui/core";

const Block = styled(Card)`
  width: ${CLASS_BLOCK_WIDTH}px;
  height: ${CLASS_BLOCK_HEIGHT}px;
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

const TextWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-top: 7px;
  align-items: start;
`;

const Subtitle = styled.div`
  font-size: 11px;
`;

interface ClassBlockProps {
  class: DNDScheduleCourse;
  index: number;
}

export default class ClassBlock extends React.Component<ClassBlockProps> {
  render() {
    return (
      <Draggable draggableId={this.props.class.dndId} index={this.props.index}>
        {provided => (
          <Block
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Indent />
            <ClassBlockBody>
              <TextWrapper>
                <div>{this.props.class.subject + this.props.class.classId}</div>
                <Subtitle>{"Object-Oriented Design"}</Subtitle>
              </TextWrapper>
            </ClassBlockBody>
          </Block>
        )}
      </Draggable>
    );
  }
}
