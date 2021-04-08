import React, { useState, useEffect } from "react";
import { GraduateHeader } from "../components/common/GraduateHeader";
import { resetStudentAction } from "../state/actions/studentActions";
import { removeAuthTokenFromCookies } from "../utils/auth-helpers";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components";
import { ICourseManagmentBlock } from "../models/types";
import { mockCourseManagmentBlock } from "../data/mockData";

const PageContainer = styled.div``;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid red;
  height: 700px; // how to make this 100%? without hard coding
`;

// left half
const CourseListViewWrapper = styled.div`
  width: 70%;
  border-right: 1px solid #dfdeda;
`;

// right half
const CourseManagementSideBarWrapper = styled.div`
  width: 30%;
`;

const CourseListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CourseBlockWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const CourseText = styled.div`
  height: 24px;
  font-family: Roboto;
  font-size: 15px;
`;

interface CourseListViewProps {
  courses: ICourseManagmentBlock[];
}

interface CourseBlockProps {
  course: ICourseManagmentBlock;
}

export const CourseManagmentPage: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <>
      <GraduateHeader />
      <ContentWrapper>
        <CourseListViewWrapper>
          <CourseListView courses={mockCourseManagmentBlock}> </CourseListView>
        </CourseListViewWrapper>
        <CourseManagementSideBar></CourseManagementSideBar>
      </ContentWrapper>
    </>
  );
};

const CourseListView: React.FC<CourseListViewProps> = (
  props: CourseListViewProps
) => {
  return (
    <CourseListWrapper>
      {props.courses.map((course: ICourseManagmentBlock) => (
        <CourseBlock course={course}></CourseBlock>
      ))}
    </CourseListWrapper>
  );
};

const CourseBlock: React.FC<CourseBlockProps> = (props: CourseBlockProps) => {
  return (
    <CourseBlockWrapper>
      <CourseText>{props.course.courseId}</CourseText>
      <CourseText>{props.course.courseName}</CourseText>
      <CourseText>{props.course.numStudents}</CourseText>
      <CourseText>{props.course.numConflicts}</CourseText>
    </CourseBlockWrapper>
  );
};

const CourseManagementSideBar: React.FC = () => {
  return (
    <CourseManagementSideBarWrapper> SIDEBAR</CourseManagementSideBarWrapper>
  );
};
