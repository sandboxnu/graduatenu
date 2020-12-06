import React, { useEffect, useState } from "react";
import { ScheduleCourse } from "../../../common/types";
import { Modal, CircularProgress, TextField } from "@material-ui/core";
import styled from "styled-components";
import { XButton } from "./common";
import { Search } from "./common/Search";
import { searchCourses } from "../api";
import AddIcon from "@material-ui/icons/Add";
import { isCourseInSchedule } from "../utils/schedule-helpers";
import { NextButton } from "./common/NextButton";

interface AddClassSearchModalProps {
  visible: boolean;
  handleClose: () => void;
  handleSubmit: (courses: ScheduleCourse[]) => void;
}

const CloseButtonWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 18px;
`;

const InnerSection = styled.section`
  position: fixed;
  background: white;
  width: 35%;
  height: auto;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  padding-bottom: 24px;
`;

const SearchResultsScrollContainer = styled.div`
  height: 200px;
  width: 80%;
  margin: 30px;
  border: 1px solid red;
  border-radius: 10px;
  overflow-y: scroll;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
`;
const SearchResultContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  margin-left: 20px;
  margin-right: 30px;
`;

const AddedClassesContainer = styled.div``;

const ResultInfoContainer = styled.div``;

const AddClassButton = styled.div``;

const SubjectId = styled.div`
  font-size: 10px;
  line-height: 21px;
`;

const CourseName = styled.div`
  font-size: 15px;
  line-height: 21px;
`;

const EMPTY_COURSE_LIST: ScheduleCourse[] = [];

interface SearchResultProps {
  course: ScheduleCourse;
}

export const AddClassSearchModal: React.FC<
  AddClassSearchModalProps
> = props => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchedCourses, setSearchedCourses] = useState(EMPTY_COURSE_LIST);
  const [selectedCourses, setSelectedCourses] = useState(EMPTY_COURSE_LIST);

  const SearchResult = (props: SearchResultProps) => {
    return (
      <SearchResultContainer
        key={props.course.subject + " " + props.course.classId}
      >
        <ResultInfoContainer>
          <CourseName>{props.course.name}</CourseName>
          <SubjectId>
            {props.course.subject + " " + props.course.classId}
          </SubjectId>
        </ResultInfoContainer>
        <AddClassButton
          onClick={() => {
            if (selectedCourses.indexOf(props.course) < 0) {
              setSelectedCourses([...selectedCourses, props.course]);
            }
          }}
        >
          <AddIcon color="secondary" style={{ fontSize: 24 }} />
        </AddClassButton>
      </SearchResultContainer>
    );
  };

  const fetchCourses = () => {
    if (searchQuery != "") {
      setIsLoading(true);
      searchCourses(searchQuery)
        .then(searchedCourses => {
          setSearchedCourses(searchedCourses);
          console.log(searchedCourses);
          setIsLoading(false);
        })
        .catch(err => console.log(err));
    }
  };

  useEffect(() => {
    setSearchedCourses(EMPTY_COURSE_LIST);
    fetchCourses();
  }, [searchQuery]);

  const searchedCourseResults = searchedCourses.map(course => {
    return <SearchResult course={course} />;
  });

  return (
    <Modal
      style={{ outline: "none" }}
      open={props.visible}
      onClose={() => null}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <InnerSection>
        <CloseButtonWrapper>
          <XButton onClick={props.handleClose}></XButton>
        </CloseButtonWrapper>
        <h1 id="simple-modal-title">Add classes</h1>
        <Search placeholder="Search for classes" onEnter={setSearchQuery} />
        <SearchResultsScrollContainer>
          {searchedCourseResults}
        </SearchResultsScrollContainer>
        <AddedClassesContainer>
          {selectedCourses.length === 0
            ? "Select classes to add"
            : selectedCourses.map(
                selectedCourse =>
                  selectedCourse.subject + selectedCourse.classId + " "
              )}
        </AddedClassesContainer>
        <NextButton
          text="Add Classes"
          onClick={() => props.handleSubmit(selectedCourses)}
        />
      </InnerSection>
    </Modal>
  );
};
