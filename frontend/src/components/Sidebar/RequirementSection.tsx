import React from "react";
import {
  IMajorRequirementGroup,
  Requirement,
  IRequiredCourse,
  ICourseRange,
  ISubjectRange,
} from "../../models/types";
import styled from "styled-components";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { produceRequirementGroupWarning } from "../../utils/generate-warnings";

const CourseWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const CourseText = styled.p`
  font-size: 12px;
  margin: 4px;
`;

const CourseTextNoMargin = styled.p`
  font-size: 12px;
  margin: 0px;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const CourseAndLabWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-left: 4px;
`;

const ANDORText = styled.p`
  font-size: 11px;
  margin: 4px;
`;

interface RequirementSectionProps {
  title: string;
  contents: IMajorRequirementGroup;
}

export class RequirementSection extends React.Component<
  RequirementSectionProps
> {
  parseRequirements(reqs: Requirement[]) {
    return reqs.map(r => this.renderRequirement(r));
  }

  renderRequirement(req: Requirement) {
    if (req.type === "COURSE") {
      return this.renderCourse(req as IRequiredCourse);
    }

    if (req.type === "RANGE") {
      return this.handleRange(req as ICourseRange);
    }

    if (
      req.type === "AND" &&
      req.courses.length === 2 &&
      req.courses.filter(c => c.type === "COURSE").length === 2
    ) {
      return (
        <CourseAndLabWrapper>
          {this.renderCourse(req.courses[0] as IRequiredCourse, true)}
          <CourseText> and </CourseText>
          {this.renderCourse(req.courses[1] as IRequiredCourse, true)}
        </CourseAndLabWrapper>
      );
    }

    return (
      <div>
        <ANDORText>{this.convertTypeToText(req.type)}</ANDORText>
        {req.courses
          .filter(c => c.type === "COURSE")
          .map(c => this.renderCourse(c as IRequiredCourse))}
        {req.courses
          .filter(c => c.type === "AND")
          .map(c => this.renderRequirement(c))}
        {req.courses
          .filter(c => c.type === "OR")
          .map(c => this.renderRequirement(c))}
      </div>
    );
  }

  handleRange(req: ICourseRange) {
    return (
      <div>
        <ANDORText style={{ marginBottom: 8 }}>
          Complete {req.creditsRequired} credits from the following courses that
          are not already required:
        </ANDORText>
        {req.ranges.map((r: ISubjectRange) => {
          return (
            <CourseText>
              {r.subject + r.idRangeStart + " through " + r.idRangeEnd}
            </CourseText>
          );
        })}
      </div>
    );
  }

  renderCourse(course: IRequiredCourse, noMargin: boolean = false) {
    return (
      <CourseWrapper>
        <CheckIcon color="action" fontSize="small"></CheckIcon>
        {noMargin ? (
          <CourseTextNoMargin>
            {course.subject + course.classId}
          </CourseTextNoMargin>
        ) : (
          <CourseText>{course.subject + course.classId}</CourseText>
        )}
      </CourseWrapper>
    );
  }

  convertTypeToText(type: string) {
    if (type === "OR") {
      return "Complete one of the following:";
    }

    return type;
  }

  render() {
    const { title, contents } = this.props;

    return (
      <div>
        {!!title && <p>{title}</p>}
        {!!contents &&
          contents.type !== "RANGE" &&
          this.parseRequirements(contents.requirements)}
        {!!contents &&
          contents.type === "RANGE" &&
          this.handleRange(contents.requirements)}
      </div>
    );
  }
}
