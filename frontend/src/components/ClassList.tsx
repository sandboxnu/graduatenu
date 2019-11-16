import React from "react";
import { CLASS_BLOCK_WIDTH, SEMESTER_MIN_HEIGHT } from "../constants";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  min-height: ${SEMESTER_MIN_HEIGHT}px;
  flex-direction: column;
  width: ${CLASS_BLOCK_WIDTH + 4}px;
`;

interface ClassListProps {
  innerRef: React.RefObject<HTMLDivElement>;
}

export default class ClassList extends React.Component<ClassListProps> {
  render() {
    return <Wrapper ref={this.props.innerRef}>{this.props.children}</Wrapper>;
  }
}
