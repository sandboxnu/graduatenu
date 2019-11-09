import React from "react";
import { Droppable } from "react-beautiful-dnd";
import ClassList from "./ClassList";
import ClassBlock from "./ClassBlock";
import EmptyBlock from "./EmptyBlock";
import { DNDScheduleTerm } from "../models/types";
import { AddButton } from "./Year/AddButton";
import styled from "styled-components";

interface SemesterBlockProps {
  semester: DNDScheduleTerm;
}

const Container = styled.div`
  border: 1px solid black;
`;

const AddButtonContainer = styled.div`
	position: relative;
	right: 0px
	bottom: 0px
	zIndex: 1
`;

export default class SemesterBlock extends React.Component<SemesterBlockProps> {
  render() {
    return (
      <Container>
        <Droppable droppableId={this.props.semester.termId.toString()}>
          {provided => (
            <ClassList
              innerRef={provided.innerRef as any}
              {...provided.droppableProps}
            >
              {this.props.semester.classes.map((scheduleCourse, index) => {
                if (!!scheduleCourse) {
                  return (
                    <ClassBlock
                      key={index}
                      class={scheduleCourse}
                      index={index}
                    />
                  );
                }
                return <EmptyBlock key={index} />;
              })}
              {provided.placeholder}
            </ClassList>
          )}
        </Droppable>
        <AddButtonContainer>
          <AddButton></AddButton>
        </AddButtonContainer>
      </Container>
    );
  }
}
