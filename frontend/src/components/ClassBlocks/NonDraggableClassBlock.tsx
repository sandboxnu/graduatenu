import React from "react";
import styled from "styled-components";
import { Card } from "@material-ui/core";
import { ClassBlockBody } from "./ClassBlockBody";
import { ScheduleCourse } from "../../../../common/types";
import { GraduateGrey } from "../../constants";
import { CourseWarning } from "../../models/types";

const Block = styled(Card)`
  height: 30px;
  border-radius: 4px;
  margin: 5px 8px 5px 8px;
  display: flex;
  flex-direction: row;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15);
`;

const ClassBlockBodyContainer = styled.div<any>`
  background-color: ${props => (props.warning ? "#F8CECE" : GraduateGrey)};
  padding-left: 8px;
  flex: 1;
  min-width: 0;
`;

interface Props {
  course: ScheduleCourse;
  onDelete: (course: ScheduleCourse) => void;
  hideDelete?: boolean;
  warnings?: CourseWarning[];
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
        <ClassBlockBodyContainer warning={this.props.warnings}>
          <ClassBlockBody
            course={this.props.course}
            hovering
            onDelete={() => this.props.onDelete(this.props.course)}
            hideDelete={this.props.hideDelete}
          />
        </ClassBlockBodyContainer>
      </Block>
    );
  }
}
