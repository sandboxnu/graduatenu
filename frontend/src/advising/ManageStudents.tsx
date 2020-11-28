import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { getStudents } from "../services/AdvisorService";
import { Search } from "../components/common/Search";
import { AppState } from "../state/reducers/state";
import { getTokenFromState } from "../state";

const Container = styled.div`
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 50px;
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
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 21px;
  padding: 10px;
`;

const StudentEmailNUIDContainer = styled.div`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  color: gray;
`;

const LIST_OF_STUDENTS = [
  { name: "Mario Speedwagon", nuid: "12345", email: "mario@neu.edu" },
  { name: "Petey Cruiser", nuid: "54321", email: "petey@neu.edu" },
  { name: "Anna Sthesia", nuid: "67890", email: "anna@neu.edu" },
  { name: "Paul Molive", nuid: "09876", email: "paul@neu.edu" },
  { name: "Anna Mull", nuid: "510912", email: "anna@neu.edu" },
  { name: "Gail Forcewind", nuid: "481972", email: "gail@neu.edu" },
  { name: "Paige Turner", nuid: "512384", email: "paige@neu.edu" },
  { name: "Bob Frapples", nuid: "123498", email: "bob@neu.edu" },
  { name: "Walter Melon", nuid: "4123987", email: "walter@neu.edu" },
];

interface StudentsListProps {
  searchQuery: string;
}

interface StudentProps {
  name: string;
  nuid: string;
  email: string;
}

const ManageStudentsComponent: React.FC = (props: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  let token = useSelector((state: AppState) => getTokenFromState(state));
  token = token ? token : "";
  // getStudents(searchQuery, token).then((data: any) => console.log(data)).catch(err => console.log(err));

  return (
    <Container>
      <Search placeholder="Search by name or nuid" onEnter={setSearchQuery} />
      <StudentsList searchQuery={searchQuery} />
    </Container>
  );
};

const StudentsList = (props: StudentsListProps) => {
  return (
    <StudentListContainer>
      <StudentListScrollContainer>
        {LIST_OF_STUDENTS.filter(
          student =>
            student.name.includes(props.searchQuery) ||
            student.nuid.includes(props.searchQuery)
        ).map(student => (
          <Student
            name={student.name}
            nuid={student.nuid}
            email={student.email}
          />
        ))}
      </StudentListScrollContainer>
    </StudentListContainer>
  );
};

const Student = (props: StudentProps) => {
  return (
    <StudentContainer>
      {props.name}
      <StudentEmailNUIDContainer>
        {props.email + " | " + props.nuid}
      </StudentEmailNUIDContainer>
    </StudentContainer>
  );
};

export const ManageStudents = withRouter(ManageStudentsComponent);
