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
  height: calc(100vh - 85px);
  background-color: #f8f7f4;
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

const CourseListViewBodyWrapper = styled.div`
  border-top: 1px solid #dfdeda;
  margin: 0px 20px 0px 20px;
  height: calc(100vh - 200px);
`;

// contains course list label and each course
const CourseListWrapper = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  margin: 40px 40px 0px 40px;
`;

const CourseListLabels = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #f9f9f9;
  height: 35px;
  align-items: center;
`;

// each course in the list
const CourseBlockWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid #dfdeda;
  border-left: 1px solid #dfdeda;
  border-right: 1px solid #dfdeda;
  border-bottom: 1px solid #dfdeda;
  height: 35px;
  align-items: center;
`;

const CourseText = styled.div`
  height: 24px;
  font-family: Roboto;
  font-size: 15px;
  min-width: 15%;
  max-width: 15%;
  margin-left: 10px;
`;

const CourseArrowWrapper = styled.div`
  height: 24px;
  min-width: 5%;
  max-width: 5%;
  text-align: right;
`;

// course name text gets more space than other course metadata
const CourseNameText = styled.div`
  height: 24px;
  font-family: Roboto;
  font-size: 15px;
  min-width: 45%;
  max-width: 45%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
            <YearAndArrow>
              <HeaderText>Fall 2021</HeaderText>
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
          <CourseListViewBodyWrapper>
            <CourseListView courses={mockCourseManagmentBlock}></CourseListView>
          </CourseListViewBodyWrapper>
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
      <CourseListLabels>
        <CourseText>Course Number</CourseText>
        <CourseNameText>Course Name</CourseNameText>
        <CourseText>Students</CourseText>
        <CourseText>Conflicts</CourseText>
      </CourseListLabels>
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
      <CourseNameText>{props.course.courseName}</CourseNameText>
      <CourseText>{props.course.numStudents}</CourseText>
      <CourseText>{props.course.numConflicts}</CourseText>
      <CourseArrowWrapper>
        <KeyboardArrowDownIcon />
      </CourseArrowWrapper>
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
