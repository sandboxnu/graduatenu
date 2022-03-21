import React, { FunctionComponent } from "react";
import { Checkbox } from "@material-ui/core";
import styled from "styled-components";
import { IFolderData, ITemplatePlan } from "../../models/types";
import { getTemplates, TemplatesAPI } from "../../services/TemplateService";
import { useSelector } from "react-redux";
import { AppState } from "../../state/reducers/state";
import { getAdvisorUserIdFromState } from "../../state";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import {
  AssignTemplateModalProps,
  GenericSearchAssignModal,
  OptionsProps,
} from "../../components/common/GenericSearchModal";
import { isSearchedTemplate } from "../Templates/TemplateUtils";

const FolderName = styled.div`
  font-weight: bold;
  margin-left: 10px;
  margin-top: 5px;
`;

const FolderTemplateListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
`;

export const AssignTemplateToUserModal: FunctionComponent<
  AssignTemplateModalProps<ITemplatePlan>
> = (props) => {
  const { userId } = useSelector((state: AppState) => ({
    userId: getAdvisorUserIdFromState(state),
  }));
  const fetchTemplates = (
    currentList: IFolderData[],
    searchQuery: string,
    page: number,
    setIsLoading: (loading: boolean) => void,
    setResponse: (response: any, newList: IFolderData[]) => void
  ) => {
    setIsLoading(true);
    getTemplates(userId, searchQuery, page)
      .then((response: TemplatesAPI) => {
        setResponse(response, currentList.concat(response.templates));
        setIsLoading(false);
      })
      .catch((err: any) => console.log(err));
  };

  const FolderOption: FunctionComponent<
    OptionsProps<IFolderData, ITemplatePlan>
  > = ({ item: folder, selected, setSelected, searchQuery = "" }) => {
    const filteredTemplatePlans = folder.templatePlans.filter(
      (template: ITemplatePlan) =>
        isSearchedTemplate(template, folder, searchQuery)
    );

    return filteredTemplatePlans.length > 0 ? (
      <div>
        <FolderName> {folder.name} </FolderName>
        <FolderTemplateListContainer>
          {filteredTemplatePlans.map((template: ITemplatePlan) => (
            <div>
              <Checkbox
                checked={!!selected && template.id === selected.id}
                checkedIcon={<CheckBoxIcon style={{ color: "#EB5757" }} />}
                onChange={(e) =>
                  setSelected(e.target.checked ? template : null)
                }
              />
              {template.name}
            </div>
          ))}
        </FolderTemplateListContainer>
      </div>
    ) : null;
  };
  return (
    <GenericSearchAssignModal<IFolderData, ITemplatePlan>
      fetchList={fetchTemplates}
      RenderItem={FolderOption}
      showDeleteOption={true}
      itemText={"templates"}
      {...props}
    ></GenericSearchAssignModal>
  );
};
