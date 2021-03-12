import { Card, Tooltip } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { ScheduleCourse } from "../../../../common/types";
import { ClassBlockBody } from "../ClassBlocks/ClassBlockBody";
import { SidebarClassBlock } from "./SidebarClassBlock";

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
  const [name, setName] = useState("XXXX 9999");
  const [hovering, setHovering] = useState(false);
  let scheduleCourse: ScheduleCourse = {
    name: "Default",
    subject: "XXXX",
    classId: "9999",
    numCreditsMin: 0,
    numCreditsMax: 0,
  };

  const setScheduleCourse = () => {
    var courseData = name.split(" ");
    scheduleCourse = {
      name: "Default",
      subject: courseData[0],
      classId: courseData[1],
      numCreditsMin: 0,
      numCreditsMax: 0,
    };
    return scheduleCourse;
  };

  useEffect(() => {
    scheduleCourse = setScheduleCourse();
  }, [name]);

  const draggableCourseBlock = () => {
    return (
      <Container>
        {/* TODO: draggable id has to be unique, append a counter or smth*/}
        <Draggable isDragDisabled={false} draggableId={name} index={0}>
          {provided => {
            return (
              <div
                onMouseEnter={() => {
                  setHovering(true);
                }}
                onMouseLeave={() => {
                  setHovering(false);
                }}
              >
                <Block
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  <SidebarClassBlockBodyContainer>
                    <ClassBlockBody
                      course={scheduleCourse}
                      hovering={hovering}
                      onDelete={() => this.props.onDelete(this.props.class)}
                    />
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
