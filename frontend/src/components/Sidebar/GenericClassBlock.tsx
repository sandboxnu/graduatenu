import { Card } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { ScheduleCourse } from "../../../../common/types";
import { GENERIC_COURSE_ID, GENERIC_COURSE_SUBJECT } from "../../constants";

const Container = styled.div`
  flex: 1;
  margin: 5px 0px 0px 0px;
`;

const Block = styled(Card)<any>`
  height: 25px;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15);
  width: 100%;
`;

const SidebarClassBlockBodyContainer = styled.div<any>`
  background-color: #e5e5e5;
  padding-left: 5px;
  flex: 1;
  min-width: 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  min-width: 0;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 0;
`;

const Title = styled.div`
  font-weight: normal;
  font-size: 14px;
  margin-right: 4px;
`;

export const GenericClassBlock: React.FC = () => {
  const courseCode = GENERIC_COURSE_SUBJECT + " " + GENERIC_COURSE_ID;

  const draggableCourseBlock = () => {
    return (
      <Container>
        {/* TODO: draggable id has to be unique, append a counter or smth*/}
        <Draggable isDragDisabled={false} draggableId={courseCode} index={0}>
          {provided => {
            return (
              <div>
                <Block
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  {/* omg when dragged into semester, turns from SidebarClassBlock into ClassBlock */}
                  <SidebarClassBlockBodyContainer>
                    <Wrapper>
                      <TitleWrapper>
                        <Title> {courseCode} </Title>
                      </TitleWrapper>
                    </Wrapper>
                  </SidebarClassBlockBodyContainer>
                </Block>
              </div>
            );
          }}
        </Draggable>
      </Container>
    );
  };

  return (
    <Droppable isDropDisabled={true} droppableId={"Generic Course Block"}>
      {provided => (
        <div ref={provided.innerRef as any} {...provided.droppableProps}>
          {draggableCourseBlock()}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
