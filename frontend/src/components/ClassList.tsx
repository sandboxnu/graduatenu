import React from "react";
import { CLASS_BLOCK_WIDTH, SEMESTER_MIN_HEIGHT } from "../constants";

interface ClassListProps {
  innerRef: React.RefObject<HTMLDivElement>;
}

export default class ClassList extends React.Component<ClassListProps> {
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: SEMESTER_MIN_HEIGHT,
          minWidth: CLASS_BLOCK_WIDTH + 4,
        }}
        ref={this.props.innerRef}
      >
        {this.props.children}
      </div>
    );
  }
}
