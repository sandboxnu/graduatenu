import React from "react";
import { SEMESTER_MIN_HEIGHT } from "../constants";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  min-height: ${SEMESTER_MIN_HEIGHT}px;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

interface ClassListProps {
  innerRef: React.RefObject<HTMLDivElement>;
}

export class ClassList extends React.Component<ClassListProps> {
  render() {
    return <Wrapper ref={this.props.innerRef}>{this.props.children}</Wrapper>;
  }
}
