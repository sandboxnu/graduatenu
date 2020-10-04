import React from "react";
import styled from "styled-components";
import { Card } from "@material-ui/core";
import { ClassBlockBody } from "./ClassBlockBody";
import { ScheduleCourse } from "../../../../common/types";
import { GraduateGrey } from "../../constants";

const Block = styled(Card)`
  height: 30px;
  border-radius: 4px;
  margin: 10px 8px 0px 8px;
  display: flex;
  flex-direction: row;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15);
`;

const ClassBlockBodyContainer = styled.div`
  background-color: ${GraduateGrey};
  padding-left: 8px;
  flex: 1;
  min-width: 0;
`;

interface Props {
  course: ScheduleCourse;
  onDelete: (course: ScheduleCourse) => void;
}

interface State {
  hovering: boolean;
}

export class NonDraggableClassBlock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hovering: false,
    };
  }

  render() {
    return (
      <Block>
        <ClassBlockBodyContainer>
          <ClassBlockBody
            course={this.props.course}
            hovering
            onDelete={() => this.props.onDelete(this.props.course)}
          />
        </ClassBlockBodyContainer>
      </Block>
    );
  }
}
