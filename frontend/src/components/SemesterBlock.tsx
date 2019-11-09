import React from "react";
import { Droppable } from "react-beautiful-dnd";
import ClassList from "./ClassList";
import ClassBlock from "./ClassBlock";
import EmptyBlock from "./EmptyBlock";
import { AddClassModal } from "./AddClassModal";
import { DNDScheduleTerm, NamedScheduleCourse } from "../models/types";
import { AddButton } from "./Year/AddButton";
import styled from "styled-components";

const Container = styled.div`
  border: 1px solid black;
`;

const AddButtonContainer = styled.div`
	position: relative;
	right: 0px
	bottom: 0px
	zIndex: 1
`;

interface SemesterBlockProps {
  semester: DNDScheduleTerm;
  handleAddClasses: (courses: NamedScheduleCourse[]) => void;
}

interface SemesterBlockState {
  modalVisible: boolean;
}

export default class SemesterBlock extends React.Component<
  SemesterBlockProps,
  SemesterBlockState
> {
  constructor(props: SemesterBlockProps) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  showModal() {
    this.setState({ modalVisible: true });
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  render() {
    return (
      <div>
        <AddClassModal
          visible={this.state.modalVisible}
          handleClose={this.hideModal.bind(this)}
          handleSubmit={this.props.handleAddClasses}
        ></AddClassModal>

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
            <AddButton onClick={this.showModal.bind(this)}></AddButton>
          </AddButtonContainer>
        </Container>
      </div>
    );
  }
}
