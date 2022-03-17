import React, { useEffect, useState } from "react";
import { ScheduleCourse } from "@graduate/common";
import { useSelector } from "react-redux";
import { Modal } from "@material-ui/core";
import styled from "styled-components";
import { XButton } from "./common";
import { Search } from "./common/Search";
import { searchCourses } from "../api";
import AddIcon from "@material-ui/icons/Add";
import LinearProgress from "@material-ui/core/LinearProgress";
import { isCourseInSchedule } from "../utils/schedule-helpers";
import { PrimaryButton } from "./common/PrimaryButton";
import { NonDraggableClassBlock } from "./ClassBlocks/NonDraggableClassBlock";
import {
  courseToString,
  getScheduleCourseCoreqs,
} from "../utils/course-helpers";
import { AppState } from "../state/reducers/state";
import { safelyGetActivePlanScheduleFromState } from "../state";
import { DefaultModal } from "./common/DefaultModal";
import Tooltip from "@material-ui/core/Tooltip";

interface AddClassSearchModalProps {
  visible: boolean;
  handleClose: () => void;
  handleSubmit: (courses: ScheduleCourse[]) => void;
}

const SearchContainer = styled.div`
  width: 100%;
`;

const SearchResultsScrollContainer = styled.div`
  height: 200px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
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
  margin-left: 15px;
  margin-right: 30px;
`;

const NoResultContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  margin-left: 15px;
  margin-right: 30px;
`;

const Loading = styled.div`
  font-size: 10px;
  line-height: 10px;
  margin-top: 10px;
  margin-bottom: 5px;
  margin-left: 10px;
  margin-right: 10px;
`;

const AddedClassesContainer = styled.div``;

const ResultInfoContainer = styled.div``;

const AddClassButton = styled.div`
  padding: 5px;
  background: pink;
  width: 18px;
  height: 18px;
  -moz-border-radius: 50px;
  -webkit-border-radius: 50px;
  border-radius: 50px;
  align-items: center;
  &:hover {
    background: red;
  }
`;

const AddClassError = styled.div`
  background: pink;
  color: white;
  width: 18px;
  height: 18px;
  padding: 5px;
  font-size: 16px;
  font-weight: 800;
  -moz-border-radius: 50px;
  -webkit-border-radius: 50px;
  border-radius: 50px;
  text-align: center;
`;

const SubjectId = styled.div`
  font-size: 10px;
  line-height: 21px;
`;

const CourseName = styled.div`
  font-size: 15px;
  line-height: 21px;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
`;

const EMPTY_COURSE_LIST: ScheduleCourse[] = [];

interface SearchResultProps {
  course: ScheduleCourse;
}

export const AddClassSearchModal: React.FC<AddClassSearchModalProps> = (
  props
) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchedCourses, setSearchedCourses] = useState(EMPTY_COURSE_LIST);
  const [selectedCourses, setSelectedCourses] = useState(EMPTY_COURSE_LIST);
  const { schedule } = useSelector((state: AppState) => ({
    schedule: safelyGetActivePlanScheduleFromState(state),
  }));

  const addClass = async (courseToAdd: ScheduleCourse) => {
    if (!selectedCourses.includes(courseToAdd)) {
      const courseCoreqs = await getScheduleCourseCoreqs(courseToAdd);
      const newSelectedCourses = [...selectedCourses, courseToAdd].concat(
        courseCoreqs
      );
      setSelectedCourses(newSelectedCourses);
    }
  };

  const SearchResult = (props: SearchResultProps) => {
    let showCourseInScheduleError = false;
    if (schedule != null) {
      showCourseInScheduleError = isCourseInSchedule(props.course, schedule);
    }
    return (
      <SearchResultContainer key={courseToString(props.course)}>
        <ResultInfoContainer>
          <CourseName>{props.course.name}</CourseName>
          <SubjectId>
            {props.course.subject + " " + props.course.classId}
          </SubjectId>
        </ResultInfoContainer>
        {showCourseInScheduleError ? (
          <Tooltip title="Course already in schedule" aria-label="add">
            <AddClassError>!</AddClassError>
          </Tooltip>
        ) : (
          <AddClassButton onClick={async () => addClass(props.course)}>
            <Tooltip title="Add" aria-label="add">
              <AddIcon style={{ fontSize: "18px", color: "white" }} />
            </Tooltip>
          </AddClassButton>
        )}
      </SearchResultContainer>
    );
  };

  const SearchResults = () => {
    return (
      <SearchResultsScrollContainer>
        {isLoading ? (
          <Loading>
            <LinearProgress color="secondary" />
          </Loading>
        ) : searchedCourseResults.length === 0 ? (
          <NoResultContainer> No results </NoResultContainer>
        ) : (
          searchedCourseResults
        )}
      </SearchResultsScrollContainer>
    );
  };

  const AddedClasses = () => {
    return (
      <AddedClassesContainer>
        {selectedCourses.map((selectedCourse) => (
          <NonDraggableClassBlock
            key={courseToString(selectedCourse)}
            course={selectedCourse}
            onDelete={() => {
              let copy = [...selectedCourses];
              var index = copy.indexOf(selectedCourse);
              if (index !== -1) {
                copy.splice(index, 1);
                setSelectedCourses(copy);
              }
            }}
          />
        ))}
      </AddedClassesContainer>
    );
  };

  const onClose = () => {
    props.handleClose();
    setSearchQuery("");
    setSearchedCourses(EMPTY_COURSE_LIST);
    setSelectedCourses(EMPTY_COURSE_LIST);
    setIsLoading(false);
  };

  const fetchCourses = () => {
    if (searchQuery != "") {
      setIsLoading(true);
      searchCourses(searchQuery)
        .then((searchedCourses) => {
          setSearchedCourses(searchedCourses);
          setIsLoading(false);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    setSearchedCourses(EMPTY_COURSE_LIST);
    fetchCourses();
  }, [searchQuery]);

  const searchedCourseResults = searchedCourses.map((course) => {
    return <SearchResult course={course} />;
  });

  return (
    <DefaultModal isOpen={props.visible} onClose={onClose} title="Add classes">
      <SearchContainer>
        <Search
          placeholder="Search for classes"
          onEnter={setSearchQuery}
          isSmall={true}
        />
      </SearchContainer>
      <SearchResults />
      <AddedClasses />
      <ButtonContainer>
        <PrimaryButton
          onClick={() => {
            props.handleSubmit(selectedCourses);
            onClose();
          }}
          disabled={selectedCourses.length === 0}
        >
          Add Classes
        </PrimaryButton>
      </ButtonContainer>
    </DefaultModal>
  );
};
