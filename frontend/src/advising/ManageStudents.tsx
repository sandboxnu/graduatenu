import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { getStudents } from "../services/AdvisorService";
import { Search } from "../components/common/Search";
import { AppState } from "../state/reducers/state";
import { getTokenFromState } from "../state";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";

const Container = styled.div`
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 50px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
`;

const StudentListScrollContainer = styled.div`
  width: auto;
  height: 360px;
  padding: 20px;
  overflow-y: scroll;
  height: 50vh;
`;

const StudentListContainer = styled.div`
  margin-top: 30px;
  border: 1px solid red;
  border-radius: 10px;
  width: auto;
  padding: 20px;
`;

const StudentContainer = styled.div`
  font-size: 18px;
  line-height: 21px;
  padding: 10px;
`;

const StudentEmailNUIDContainer = styled.div`
  font-size: 10px;
  color: gray;
`;

const Loading = styled.div`
  font-size: 15px;
  line-height: 21px;
  margin-top: 20px;
  margin-bottom: 5px;
  margin-left: 30px;
  margin-right: 30px;
`;

const EmptyState = styled.div`
  font-size: 18px;
  line-height: 21px;
  padding: 10px;
`;

const LoadMoreStudents = styled.div`
  font-size: 10px;
  line-height: 21px;
  margin: 10px;
  color: red;
  &:hover {
    text-decoration: underline;
  }
  cursor: pointer;
`;

const NoMoreStudents = styled.div`
  font-size: 10px;
  line-height: 21px;
  margin: 10px;
  color: red;
`;

const EMPTY_STUDENT_LIST: StudentProps[] = [];

interface StudentsListProps {
  searchQuery: string;
}

interface StudentsAPI {
  students: StudentProps[];
  nextPage: number;
  lastPage: boolean;
}

interface StudentProps {
  username: string;
  // nuid: string;
  email: string;
}

const ManageStudentsComponent: React.FC = (props: any) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Container>
      <Search
        placeholder="Search by name, email, or NUID"
        onEnter={setSearchQuery}
      />
      <StudentsList searchQuery={searchQuery} />
    </Container>
  );
};

const StudentsList = (props: StudentsListProps) => {
  const [students, setStudents] = useState(EMPTY_STUDENT_LIST);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  let token = useSelector((state: AppState) => getTokenFromState(state));

  const fetchStudents = (currentStudents: StudentProps[], page: number) => {
    token = token ? token : "";
    setIsLoading(true);
    getStudents(props.searchQuery, page, token)
      .then((studentsAPI: StudentsAPI) => {
        setStudents(currentStudents.concat(studentsAPI.students));
        setPageNumber(studentsAPI.nextPage);
        setIsLastPage(studentsAPI.lastPage);
        setIsLoading(false);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    setStudents(EMPTY_STUDENT_LIST);
    fetchStudents(EMPTY_STUDENT_LIST, 0);
  }, [props.searchQuery, token]);

  return (
    <StudentListContainer>
      {isLoading ? (
        <Loading>
          <LinearProgress color="secondary" />
        </Loading>
      ) : null}
      <StudentListScrollContainer>
        {(students === null || students.length == 0) && !isLoading ? (
          <EmptyState> No students found </EmptyState>
        ) : (
          students.map(student => (
            <Student
              username={student.username}
              // nuid={student.nuid}
              email={student.email}
              key={student.username + Math.random()}
            />
          ))
        )}
        {!isLoading ? (
          isLastPage ? (
            <NoMoreStudents>No more students</NoMoreStudents>
          ) : (
            <LoadMoreStudents
              onClick={_ => fetchStudents(students, pageNumber)}
            >
              Load more students
            </LoadMoreStudents>
          )
        ) : null}
      </StudentListScrollContainer>
    </StudentListContainer>
  );
};

const Student = (props: StudentProps) => {
  return (
    <StudentContainer>
      {props.username}
      <StudentEmailNUIDContainer>
        {props.email + " | " + "NUID GOES HERE"}
      </StudentEmailNUIDContainer>
    </StudentContainer>
  );
};

export const ManageStudents = withRouter(ManageStudentsComponent);
