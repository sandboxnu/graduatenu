import React from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import {
  DNDScheduleCourse,
  CourseWarning,
  IRequiredCourse,
} from "../../models/types";
import styled from "styled-components";
import { Card, Tooltip } from "@material-ui/core";

const DraggableContainer = styled.div<any>`
  flex: 1;
  margin: 5px 0px 0px 4px;
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

interface SidebarClassBlockProps {
  class: IRequiredCourse;
  lab?: IRequiredCourse;
  index: number;
  warning?: CourseWarning;
}

interface SidebarClassBlockState {
  hovering: boolean;
}

export class SidebarClassBlock extends React.Component<
  SidebarClassBlockProps,
  SidebarClassBlockState
> {
  constructor(props: SidebarClassBlockProps) {
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
          <SidebarClassBlockBodyContainer warning={this.props.warning}>
            <Wrapper>
              <TitleWrapper>
                {this.props.lab && (
                  <Title>
                    {this.props.class.subject +
                      " " +
                      this.props.class.classId +
                      " and " +
                      this.props.lab.classId}
                  </Title>
                )}
                {!this.props.lab && (
                  <Title>
                    {this.props.class.subject + " " + this.props.class.classId}
                  </Title>
                )}
              </TitleWrapper>
            </Wrapper>
          </SidebarClassBlockBodyContainer>
        </Block>
      </div>
    );
  }

  /**
   * Returns this ClassBlock's draggableId based on whether or not it contains a lab.
   */
  getDraggableId() {
    if (this.props.lab) {
      return (
        this.props.class.subject.toUpperCase() +
        " " +
        this.props.class.classId +
        " " +
        this.props.lab.subject.toUpperCase() +
        " " +
        this.props.lab.classId
      );
    } else {
      return (
        this.props.class.subject.toUpperCase() + " " + this.props.class.classId
      );
    }
  }

  render() {
    return (
      <DraggableContainer>
        <Draggable draggableId={this.getDraggableId()} index={this.props.index}>
          {provided => {
            return !!this.props.warning ? (
              <Tooltip title={this.props.warning.message} placement="top">
                {this.renderBody(provided)}
              </Tooltip>
            ) : (
              this.renderBody(provided)
            );
          }}
        </Draggable>
      </DraggableContainer>
    );
  }
}
