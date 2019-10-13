import React from "react";
import { mockData } from "../data/mockData";
import { Droppable } from "react-beautiful-dnd";
import ClassList from "./ClassList";
import ClassBlock from "./ClassBlock";
import EmptyBlock from "./EmptyBlock";
import { ISemester } from "../../../backend/src/types";
import { AddButton } from "./Year/AddButton";
import styled from "styled-components";

interface SemesterBlockProps {
  semester: ISemester;
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
        <Droppable droppableId={this.props.semester.id}>
          {provided => (
            <ClassList
              innerRef={provided.innerRef as any}
              {...provided.droppableProps}
            >
              {this.props.semester.classIds.map((classId, index) => {
                const course = mockData.scheduled[classId];
                if (!!course) {
                  return (
                    <ClassBlock key={index} class={course} index={index} />
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
