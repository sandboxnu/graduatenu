import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { fetchUser, getStudents } from "../services/AdvisorService";
import { Search } from "../components/common/Search";
import { LinearProgress, IconButton } from "@material-ui/core";
import { getAuthToken } from "../utils/auth-helpers";
import { NonEditableSchedule } from "../components/Schedule/ScheduleComponents";
import { findAllPlansForUser } from "../services/PlanService";
import { IPlanData } from "../models/types";
import { setUserPlansAction } from "../state/actions/userPlansActions";
import { useDispatch, useSelector } from "react-redux";
import {
  getActivePlanNameFromState,
  safelyGetActivePlanScheduleFromState,
} from "../state";
import { AppState } from "../state/reducers/state";
import { Edit, Fullscreen } from "@material-ui/icons";

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
  margin-top: 5px;
  &:hover {
    background-color: #efefef;
    border-radius: 20px;
    cursor: pointer;
  }
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

const StudentPreviewContainer = styled.div`
  margin-top: 30px;
  display: flex;
  > * {
    border: 1px solid red;
    border-radius: 10px;
    height: 70vh;
    padding: 30px;
  }
`;
const ScheduleWrapper = styled.div`
  overflow-x: scroll;
  height: 95%;
`;

const SchedulePreviewContainer = styled.div`
  overflow: hidden;
  flex: 5;
`;
const PlanTitle = styled.div`
  display: flex;
  justify-content: center;
  font-size: 24px;
  height: 24px;
`;
const ButtonHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 36px;
  margin-right: 10px;
  margin-bottom: 5px;
  > button {
    padding: 3px;
  }
  svg {
    font-size: 30px;
  }
`;

const EMPTY_STUDENT_LIST: StudentProps[] = [];

interface StudentsListProps {
  searchQuery: string;
  setSelectedStudent: (studentId: StudentProps | null) => void;
}

interface StudentsAPI {
  students: StudentProps[];
  nextPage: number;
  lastPage: boolean;
}

interface StudentProps {
  fullName: string;
  nuId: string;
  email: string;
  id: number;
}

interface StudentComponentProps {
  fullName: string;
  nuId: string;
  email: string;
  id: number;
  setSelectedStudent: (studentId: StudentProps | null) => void;
}

const ManageStudentsComponent: React.FC = (props: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentProps | null>(
    null
  );

  return (
    <Container>
      <Search
        placeholder="Search by name, email, or NUID"
        onEnter={query => {
          setSearchQuery(query);
          setSelectedStudent(null);
        }}
        isSmall={false}
      />
      {selectedStudent === null ? (
        <StudentsList
          searchQuery={searchQuery}
          setSelectedStudent={setSelectedStudent}
        />
      ) : (
        <StudentPreview {...selectedStudent} />
      )}
    </Container>
  );
};

const StudentPreview = (props: StudentProps) => {
  const [noPlans, setNoPlans] = useState(false);

  const dispatch = useDispatch();
  const token = getAuthToken();
  const { planName } = useSelector((state: AppState) => ({
    planName: getActivePlanNameFromState(state),
  }));

  useEffect(() => {
    fetchUser(props.id, token).then(response => {});
    findAllPlansForUser(props.id, token).then((plans: IPlanData[]) => {
      dispatch(setUserPlansAction(plans, 2020));
      if (!plans) setNoPlans(true);
    });
  }, []);
  return (
    <StudentPreviewContainer>
      <div style={{ flex: 1, marginRight: "20px" }}></div>
      {noPlans ? (
        <div>User Has No Plans</div>
      ) : (
        <SchedulePreviewContainer>
          <PlanTitle>{planName}</PlanTitle>
          <ButtonHeader>
            <IconButton>
              <Edit />
            </IconButton>
            <IconButton>
              <Fullscreen />
            </IconButton>
          </ButtonHeader>
          <ScheduleWrapper>
            <NonEditableSchedule />
          </ScheduleWrapper>
        </SchedulePreviewContainer>
      )}
    </StudentPreviewContainer>
  );
};

const StudentsList = ({
  searchQuery,
  setSelectedStudent,
}: StudentsListProps) => {
  const [students, setStudents] = useState(EMPTY_STUDENT_LIST);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const token = getAuthToken();

  const fetchStudents = (currentStudents: StudentProps[], page: number) => {
    setIsLoading(true);
    getStudents(searchQuery, page, token)
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
  }, [searchQuery, token]);

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
              key={student.nuId}
              setSelectedStudent={setSelectedStudent}
              {...student}
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

const Student = (props: StudentComponentProps) => {
  const { email, fullName, nuId, setSelectedStudent } = props;
  return (
    <StudentContainer onClick={() => setSelectedStudent(props as StudentProps)}>
      {fullName}
      <StudentEmailNUIDContainer>
        {email + " | " + nuId}
      </StudentEmailNUIDContainer>
    </StudentContainer>
  );
};

export const ManageStudents = withRouter(ManageStudentsComponent);
