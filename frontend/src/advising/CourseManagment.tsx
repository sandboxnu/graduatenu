import React, { useState, useEffect } from "react";
import { GraduateHeader } from "../components/common/GraduateHeader";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { ICourseManagmentBlock } from "../models/types";
import { mockCourseManagmentBlock } from "../data/mockData";
import { Search } from "../components/common/Search";
import { RedColorButton } from "../components/common/ColoredButtons";

const PageContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid red;
  height: 700px; // how to make this 100%? without hard coding
`;

// left half
const CourseListViewWrapper = styled.div`
  margin-top: 10px;
  width: 70%;
  border-right: 1px solid #dfdeda;
`;

// right half
const CourseManagementSideBarWrapper = styled.div`
  margin-top: 10px;
  width: 30%;
  margin-left: 10px;
`;

// left half header
const CourseListHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 20px;
`;

const YearAndArrow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
  gap: 10px;
  width: 170px;
`;

const SearchAndFilter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
  justify-content: space-between;
  gap: 10px;
  width: 75%;
`;

const HeaderText = styled.div`
  font-weight: bold;
  font-size: 28px;
  text-decoration: none;
  color: black;
`;

const CourseListWrapper = styled.div`
  border-top: 1px solid #dfdeda;
  display: flex;
  flex-direction: column;
  margin: 0px 15px 0px 15px;
`;

// each course in the list
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <GraduateHeader />
      <PageContentWrapper>
        {/* left half */}
        <CourseListViewWrapper>
          <CourseListHeader>
            {/* TODO: get current semester */}
            <YearAndArrow>
              <HeaderText>Fall 2020</HeaderText>
              <div
                onClick={() => {
                  setIsExpanded(!isExpanded);
                  console.log("clicked arrow");
                }}
                style={{ marginRight: 4 }}
              >
                {isExpanded ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </div>
            </YearAndArrow>
            <SearchAndFilter>
              <Search
                placeholder="Search by course name or course id"
                onEnter={query => {
                  setSearchQuery(query);
                }}
                isSmall={true}
              />
              <RedColorButton
                variant="contained"
                onClick={() => {
                  console.log("filter");
                }}
              >
                Filter
              </RedColorButton>
            </SearchAndFilter>
          </CourseListHeader>
          <CourseListView courses={mockCourseManagmentBlock}> </CourseListView>
        </CourseListViewWrapper>
        {/* right half */}
        <CourseManagementSideBar></CourseManagementSideBar>
      </PageContentWrapper>
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
    <CourseManagementSideBarWrapper>
      <HeaderText>Summary</HeaderText>
    </CourseManagementSideBarWrapper>
  );
};
