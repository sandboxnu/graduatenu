import { Checkbox, LinearProgress } from "@material-ui/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import { RedColorButton } from "../../components/common/ColoredButtons";
import { DefaultModal } from "../../components/common/DefaultModal";
import { Search } from "../../components/common/Search";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import {
  getStudents,
  IAbrStudent,
  StudentsAPI,
} from "../../services/AdvisorService";

const SearchContainer = styled.div`
  width: 100%;
`;
const DeletePlanContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
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

const Loading = styled.div`
  font-size: 10px;
  line-height: 10px;
  margin-top: 10px;
  margin-bottom: 5px;
  margin-left: 10px;
  margin-right: 10px;
`;

const NoResultContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  margin-left: 15px;
  margin-right: 30px;
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

interface StudentOptionProps {
  student: IAbrStudent;
}
interface AssignTemplateModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onClose: (studentId: number, shouldDelete: boolean) => void;
}

export const AssignUserToTemplateModal: FunctionComponent<AssignTemplateModalProps> = ({
  isOpen,
  closeModal,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<IAbrStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [shouldDelete, setShouldDelete] = useState(false);

  const fetchStudents = (currentStudents: IAbrStudent[], page: number) => {
    setIsLoading(true);
    getStudents(searchQuery, page)
      .then((studentsAPI: StudentsAPI) => {
        setStudents(currentStudents.concat(studentsAPI.students));
        setPageNumber(studentsAPI.nextPage);
        setIsLastPage(studentsAPI.lastPage);
        setIsLoading(false);
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    setStudents([]);
    fetchStudents([], 0);
  }, [searchQuery]);

  const StudentOption: FunctionComponent<StudentOptionProps> = ({
    student,
  }) => {
    return (
      <div key={student.id + student.fullName}>
        <Checkbox
          checked={student.id === selectedStudent}
          checkedIcon={<CheckBoxIcon style={{ color: "#EB5757" }} />}
          onChange={e =>
            setSelectedStudent(e.target.checked ? student.id : null)
          }
        />
        {student.fullName}
      </div>
    );
  };
  const renderStudentList = () => {
    return (
      <SearchResultsScrollContainer>
        {isLoading ? (
          <Loading>
            <LinearProgress color="secondary" />
          </Loading>
        ) : students.length === 0 ? (
          <NoResultContainer> No results </NoResultContainer>
        ) : (
          students.map(student => (
            <StudentOption key={student.id} student={student} />
          ))
        )}
        {isLastPage ? (
          <NoMoreStudents>No more students</NoMoreStudents>
        ) : (
          <LoadMoreStudents onClick={() => fetchStudents(students, pageNumber)}>
            Load more students
          </LoadMoreStudents>
        )}
      </SearchResultsScrollContainer>
    );
  };

  return (
    <DefaultModal isOpen={isOpen} onClose={closeModal} title={"Assign to"}>
      <SearchContainer>
        <Search
          placeholder="Search for students"
          onEnter={setSearchQuery}
          isSmall={true}
        />
      </SearchContainer>
      {renderStudentList()}
      <DeletePlanContainer>
        <Checkbox
          onChange={e => setShouldDelete(e.target.checked)}
          checkedIcon={<CheckBoxIcon style={{ color: "#EB5757" }} />}
        />{" "}
        Delete Template Plan on Assign
      </DeletePlanContainer>
      <RedColorButton
        onClick={() => {
          closeModal();
          onClose(selectedStudent!, shouldDelete);
        }}
        disabled={selectedStudent === null}
      >
        {"   Assign   "}
      </RedColorButton>
    </DefaultModal>
  );
};
