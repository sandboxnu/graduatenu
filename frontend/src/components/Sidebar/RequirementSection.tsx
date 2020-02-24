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
import { SidebarAddButton } from "./SidebarAddButton";
import { SidebarAddClassModal } from "./SidebarAddClassModal";

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
  margin-bottom: 4px;
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
  modalVisible: boolean;
  selectedCourses: IRequiredCourse[];
}

export class RequirementSection extends React.Component<
  RequirementSectionProps,
  RequirementSectionState
> {
  constructor(props: RequirementSectionProps) {
    super(props);

    this.state = {
      expanded: !!props.warning,
      modalVisible: false,
      selectedCourses: [
        {
          type: "COURSE",
          classId: 0,
          subject: "",
        },
      ],
    };
  }

  /**
   * Shows this SidebarAddClassModal and passes the given courses to the modal.
   * @param courses the list of courses that triggered the showModal call
   */
  showModal(courses: IRequiredCourse[]) {
    this.setState({
      modalVisible: true,
      selectedCourses: courses,
    });
  }

  /**
   * Hides this SidebarAddClassModal.
   */
  hideModal() {
    this.setState({ modalVisible: false });
  }

  componentWillReceiveProps(nextProps: RequirementSectionProps) {
    this.setState({
      expanded: !!nextProps.warning,
    });
  }

  /**
   * Maps the given list of requirements to the render function.
   * @param reqs the list of requirements to be rendered
   */
  parseRequirements(reqs: Requirement[]) {
    return reqs.map((r: Requirement, index: number) => (
      <div key={index}>{this.renderRequirement(r, index)}</div>
    ));
  }

  /**
   * Handles each Requirement type to render the given Requirement at the given index.
   * @param req the requirement to be rendered
   * @param index the designated index of this requirement
   */
  renderRequirement(req: Requirement, index: number) {
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
        <CourseAndLabWrapper key={index}>
          {this.renderCourse(req.courses[0] as IRequiredCourse, true, false)}
          <CourseText> and </CourseText>
          {this.renderCourse(req.courses[1] as IRequiredCourse, true, true, req
            .courses[0] as IRequiredCourse)}
        </CourseAndLabWrapper>
      );
    }

    return (
      <div key={index.toString()}>
        <ANDORText>{this.convertTypeToText(req.type)}</ANDORText>
        {req.courses
          .filter(c => c.type === "COURSE")
          .map(c => this.renderCourse(c as IRequiredCourse))}
        {req.courses
          .filter(c => c.type === "AND")
          .map((c: Requirement, index: number) =>
            this.renderRequirement(c, index)
          )}
        {req.courses
          .filter(c => c.type === "OR")
          .map((c: Requirement, index: number) =>
            this.renderRequirement(c, index)
          )}
      </div>
    );
  }

  /**
   * Renders a given ICourseRange as a sidebar requirement
   * @param req the given course range to be rendered
   */
  handleRange(req: ICourseRange) {
    return (
      <div>
        <ANDORText style={{ marginBottom: 8 }}>
          Complete {req.creditsRequired} credits from the following courses that
          are not already required:
        </ANDORText>
        {req.ranges.map((r: ISubjectRange, index: number) => {
          return (
            <CourseText key={r.subject + r.idRangeStart + " - " + r.idRangeEnd}>
              {r.subject + r.idRangeStart + " through " + r.idRangeEnd}
            </CourseText>
          );
        })}
      </div>
    );
  }

  /**
   * Renders the given course as a sidebar course.
   * @param course the given IRequiredCourse
   * @param noMargin determines if this sidebar course should have a margin or not
   * @param addButton determines if this sidebar course should have a SidebarAddButton
   * @param andCourse true if the given course is an and course
   */
  renderCourse(
    course: IRequiredCourse,
    noMargin: boolean = false,
    addButton: boolean = true,
    andCourse?: IRequiredCourse
  ) {
    return (
      <CourseWrapper key={course.subject + course.classId + course.type}>
        {noMargin ? (
          <CourseTextNoMargin>
            {course.subject + course.classId}
          </CourseTextNoMargin>
        ) : (
          <CourseText>{course.subject + course.classId}</CourseText>
        )}
        {addButton && andCourse && (
          <SidebarAddButton
            onClick={() => this.showModal([andCourse, course])}
          />
        )}
        {addButton && !andCourse && (
          <SidebarAddButton onClick={() => this.showModal([course])} />
        )}
      </CourseWrapper>
    );
  }

  /**
   * Translates type to desired display text in sidebar.
   * @param type the given Requirement type
   */
  convertTypeToText(type: string) {
    if (type === "OR") {
      return "Complete one of the following:";
    }

    return type;
  }

  /**
   * Updates the state to show more of this requirement section.
   */
  expandSection() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { title, contents, warning } = this.props;
    const { modalVisible } = this.state;

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

        <SidebarAddClassModal
          visible={modalVisible}
          handleClose={this.hideModal.bind(this)}
          handleSubmit={this.hideModal.bind(this)}
          selectedCourses={this.state.selectedCourses}
        ></SidebarAddClassModal>
      </div>
    );
  }
}
