import React, { FunctionComponent } from "react";
import { Checkbox } from "@material-ui/core";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import {
  getStudents,
  IAbrStudent,
  StudentsAPI,
} from "../../services/AdvisorService";
import {
  AssignTemplateModalProps,
  GenericSearchAssignModal,
  OptionsProps,
} from "../../components/common/GenericSearchModal";

export const AssignUserToTemplateModal: FunctionComponent<
  AssignTemplateModalProps<IAbrStudent>
> = (props) => {
  const fetchStudents = (
    currentList: IAbrStudent[],
    searchQuery: string,
    page: number,
    setIsLoading: (loading: boolean) => void,
    setResponse: (response: any, newList: IAbrStudent[]) => void
  ) => {
    setIsLoading(true);
    getStudents(searchQuery, page)
      .then((studentsAPI: StudentsAPI) => {
        setResponse(studentsAPI, currentList.concat(studentsAPI.students));
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const StudentOption: FunctionComponent<
    OptionsProps<IAbrStudent, IAbrStudent>
  > = ({ item: student, selected, setSelected }) => {
    return (
      <div key={student.id + student.fullName}>
        <Checkbox
          checked={!!selected && student.id === selected.id}
          checkedIcon={<CheckBoxIcon style={{ color: "#EB5757" }} />}
          onChange={(e) => setSelected(e.target.checked ? student : null)}
        />
        {student.fullName}
      </div>
    );
  };
  return (
    <GenericSearchAssignModal<IAbrStudent, IAbrStudent>
      fetchList={fetchStudents}
      RenderItem={StudentOption}
      showDeleteOption={true}
      itemText={"students"}
      {...props}
    />
  );
};
