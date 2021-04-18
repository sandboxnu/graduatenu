import React, { useState, useEffect } from "react";
import { GraduateHeader } from "../components/common/GraduateHeader";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { ICourseManagmentBlock, ICourseWithCount } from "../models/types";
import {
  mockCourseManagmentBlock,
  mockTop5ClassesWithEnrollees,
} from "../data/mockData";
import { Search } from "../components/common/Search";
import { RedColorButton } from "../components/common/ColoredButtons";
import { IconButton } from "@material-ui/core";

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
  color: black;
`;

const CourseListViewBodyWrapper = styled.div`
  border-top: 1px solid #dfdeda;
  border-bottom: 1px solid #dfdeda;
  margin: 0px 30px 0px 30px;
  height: calc(100vh - 200px);
`;

// contains list of courses
const CourseListWrapper = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  margin: 0px 10px 0px 10px;
  height: calc(100vh - 240px);
  overflow: auto;
`;

const CourseListLabels = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #f9f9f9;
  margin: 30px 10px 0px 10px;
  border-top: 1px solid #dfdeda;
  border-bottom: 1px solid #dfdeda;
  border-left: 1px solid #dfdeda;
  border-right: 1px solid #dfdeda;
  height: 35px;
  align-items: center;
`;

const UpAndDownArrow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// each course in the list
const CourseBlockWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid #dfdeda;
  border-left: 1px solid #dfdeda;
  border-right: 1px solid #dfdeda;
  height: 35px;
  align-items: center;
`;

const CourseText = styled.div`
  font-family: Roboto;
  font-size: 13px;
  min-width: 18%;
  max-width: 18%;
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

// course name text gets more space than other course metadata
const CourseNameText = styled.div`
  font-family: Roboto;
  font-size: 13px;
  min-width: 38%;
  max-width: 38%;
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CourseNameLabelText = styled.div`
  font-family: Roboto;
  font-size: 13px;
  min-width: 38%;
  max-width: 38%;
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

// contains course info for a single course (such as Top Conflicts)
const CourseInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-left: 1px solid #dfdeda;
  border-right: 1px solid #dfdeda;
  height: 140px;
`;

// contains course info for a single course (such as Top Conflicts)
const TopConflictsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  height: 90px;
  margin-left: 20%;
  min-width: 295px;
  max-width: 295px;
  padding: 10px;
  gap: 10px;
`;

// contains course info for a single course (such as Top Conflicts)
const DistributionContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  height: 110px;
  min-width: 150px;
  max-width: 150px;
  margin-left: 4%;
  padding: 10px;
  gap: 10px;
`;

const CourseInfoTextBold = styled.div`
  font-family: Roboto;
  font-size: 11px;
  font-weight: bold;
`;

const CourseInfoText = styled.div`
  font-family: Roboto;
  font-size: 11px;
`;

const DistributionInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 80px;
`;

const DistributionYearRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// right half
const CourseManagementSideBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  width: 30%;
  gap: 20px;
`;

// right half header
const SummaryHeader = styled.div`
  font-weight: bold;
  font-size: 28px;
  color: black;
`;

const ClassesMostEnrolleesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 280px;
`;

const ClassesMostEnrolleesHeader = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #15743e;
  height: 30px;
  opacity: 80%;
`;

const SidebarSubheaderText = styled.div`
  font-family: Roboto;
  margin: 8px 0px 0px 8px;
  font-size: 14px;
  color: white;
  font-weight: bold;
`;

// each course in the list
const ClassesMostEnrolleesCourse = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #5e9e78;
  border-left: 1px solid #5e9e78;
  border-right: 1px solid #5e9e78;
  background-color: #deefe5;
  height: 50px;
  align-items: center;
`;

const ClassPairsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 280px;
`;

const ClassPairsHeader = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #cc414d;
  height: 30px;
  opacity: 80%;
`;

// each course in the Class Pair list
const ClassPairsCourse = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #cc414d;
  border-left: 1px solid #cc414d;
  border-right: 1px solid #cc414d;
  background-color: #fcd0d4;
  height: 50px;
  align-items: center;
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
          <CourseList courses={mockCourseManagmentBlock}></CourseList>
        </CourseListViewWrapper>
        {/* right half */}
        <CourseManagementSideBar></CourseManagementSideBar>
      </PageContentWrapper>
    </>
  );
};

const CourseList: React.FC<CourseListViewProps> = (
  props: CourseListViewProps
) => {
  return (
    <>
      <CourseListViewBodyWrapper>
        <CourseListLabels>
          <CourseText>
            Course Number
            <SortArrows />
          </CourseText>
          <CourseNameLabelText>
            Course Name <SortArrows />
          </CourseNameLabelText>
          <CourseText>
            Students <SortArrows />
          </CourseText>
          <CourseText>
            Conflicts <SortArrows />
          </CourseText>
        </CourseListLabels>
        <CourseListWrapper>
          {props.courses.map((course: ICourseManagmentBlock) => (
            <CourseBlock course={course}></CourseBlock>
          ))}
        </CourseListWrapper>
      </CourseListViewBodyWrapper>
    </>
  );
};

const SortArrows: React.FC = () => {
  return (
    <UpAndDownArrow>
      <IconButton
        style={{ padding: 0 }}
        onClick={() => {
          console.log("sort");
        }}
      >
        <KeyboardArrowUpIcon style={{ fontSize: "14px" }} />
      </IconButton>
      <IconButton
        style={{ padding: 0 }}
        onClick={() => {
          console.log("sort");
        }}
      >
        <KeyboardArrowDownIcon style={{ fontSize: "14px" }} />
      </IconButton>
    </UpAndDownArrow>
  );
};

const CourseBlock: React.FC<CourseBlockProps> = ({
  course,
}: CourseBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
      <CourseBlockWrapper>
        <CourseText>{course.courseId}</CourseText>
        <CourseNameText>{course.courseName}</CourseNameText>
        <CourseText>{course.numStudents}</CourseText>
        <CourseText>{course.numConflicts}</CourseText>
        {isExpanded ? (
          <IconButton
            style={{ padding: 0 }}
            onClick={() => {
              setIsExpanded(false);
            }}
          >
            <KeyboardArrowUpIcon style={{ fontSize: "14px" }} />
          </IconButton>
        ) : (
          <IconButton
            style={{ padding: 0 }}
            onClick={() => {
              setIsExpanded(true);
            }}
          >
            <KeyboardArrowDownIcon style={{ fontSize: "14px" }} />
          </IconButton>
        )}
      </CourseBlockWrapper>
      {isExpanded && (
        <CourseInfoWrapper>
          <TopConflictsContainer>
            <CourseInfoTextBold> Top conflicts</CourseInfoTextBold>
            {course.topThreeConflicts.map((courseName: string) => (
              <CourseInfoText>{courseName}</CourseInfoText>
            ))}
          </TopConflictsContainer>
          <DistributionContainer>
            <CourseInfoTextBold> Distribution</CourseInfoTextBold>
            <DistributionInfoWrapper>
              <DistributionYearRow>
                {Object.keys(course.distribution).map(year => (
                  <CourseInfoText>{year}</CourseInfoText>
                ))}
              </DistributionYearRow>
              <DistributionYearRow>
                {Object.values(course.distribution).map(students => (
                  <CourseInfoTextBold>{students}</CourseInfoTextBold>
                ))}
              </DistributionYearRow>
            </DistributionInfoWrapper>
          </DistributionContainer>
        </CourseInfoWrapper>
      )}
    </div>
  );
};

const CourseManagementSideBar: React.FC = () => {
  return (
    <CourseManagementSideBarWrapper>
      <SummaryHeader>Summary</SummaryHeader>
      <ClassesMostEnrolleesWrapper>
        <ClassesMostEnrolleesHeader>
          <SidebarSubheaderText>
            Classes with most enrollees
          </SidebarSubheaderText>
        </ClassesMostEnrolleesHeader>
        {mockTop5ClassesWithEnrollees.map((course: ICourseWithCount) => (
          <ClassesMostEnrolleesCourse></ClassesMostEnrolleesCourse>
        ))}
      </ClassesMostEnrolleesWrapper>
      <ClassPairsWrapper>
        <ClassPairsHeader>
          <SidebarSubheaderText>Class Pairs</SidebarSubheaderText>
        </ClassPairsHeader>
        {mockTop5ClassesWithEnrollees.map((course: ICourseWithCount) => (
          <ClassPairsCourse></ClassPairsCourse>
        ))}
      </ClassPairsWrapper>
    </CourseManagementSideBarWrapper>
  );
};
