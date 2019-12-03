import React from "react";
import {
  IMajorRequirementGroup,
  Requirement,
  IRequiredCourse,
  ICourseRange,
  ISubjectRange,
  IRequirementGroupWarning,
} from "../../models/types";
import styled from "styled-components";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { styled as materialStyled } from "@material-ui/styles";
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@material-ui/icons/ExpandLessOutlined";

const SectionHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

const TitleText = styled.div`
  margin-left: 4px;
`;

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

const MyCheckIcon = materialStyled(CheckIcon)({
  color: "green",
});

interface RequirementSectionProps {
  title: string;
  contents: IMajorRequirementGroup;
  warning?: IRequirementGroupWarning;
}

interface RequirementSectionState {
  expanded: boolean;
}

export class RequirementSection extends React.Component<
  RequirementSectionProps,
  RequirementSectionState
> {
  constructor(props: RequirementSectionProps) {
    super(props);

    this.state = {
      expanded: !!props.warning,
    };
  }

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

  expandSection() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { title, contents, warning } = this.props;

    return (
      <div>
        {!!title && (
          <SectionHeaderWrapper onClick={this.expandSection.bind(this)}>
            <TitleWrapper>
              {!!warning ? (
                <ClearIcon color="error" fontSize="small"></ClearIcon>
              ) : (
                <MyCheckIcon fontSize="small"></MyCheckIcon>
              )}
              <TitleText>{title}</TitleText>
            </TitleWrapper>
            {this.state.expanded ? (
              <ExpandLessOutlinedIcon />
            ) : (
              <ExpandMoreOutlinedIcon />
            )}
          </SectionHeaderWrapper>
        )}
        {this.state.expanded && (
          <div>
            {!!contents &&
              contents.type !== "RANGE" &&
              this.parseRequirements(contents.requirements)}
            {!!contents &&
              contents.type === "RANGE" &&
              this.handleRange(contents.requirements)}
          </div>
        )}
      </div>
    );
  }
}
