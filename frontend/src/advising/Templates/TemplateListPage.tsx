import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Search } from "../../components/common/Search";
import { AppState } from "../../state/reducers/state";
import { TemplatePageState, TemplateProps } from "./Templates";
import { getFolderExpandedFromState } from "../../state";
import { toggleTemplateFolderExpandedAction } from "../../state/actions/advisorActions";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { WhiteColorButton, ColorButton } from "../GenericAdvisingTemplate";

const Container = styled.div`
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 50px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  overflow: hidden;
`;

const TemplatesContainer = styled.div`
  margin-top: 30px;
  border: 1px solid red;
  border-radius: 10px;
  width: auto;
  padding: 40px;
  height: 50vh;
`;

const TemplateListContainer = styled.div`
  width: auto;
  height: 400px;
`;

const TemplateListScrollContainer = styled.div`
  overflow-y: scroll;
  height: 90%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-bottom: 20px;
`;

const FolderNameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const FolderTemplateListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 28px;
`;

const FolderName = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const TemplateName = styled.div`
  margin-bottom: 5px;
  margin-top: 5px;
`;

interface TemplatesPageProps {
  readonly setPageState: (pageState: TemplatePageState) => void;
}

interface FolderProps {
  index: number;
  folder: Folder;
}

interface Folder {
  name: string;
  templates: Array<string>;
}

export const TemplatesListPage: React.FC<TemplatesPageProps> = ({
  setPageState,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const folders = [
    { name: "non-shared", templates: ["file 1", "file 2"] },
    { name: "catalog year 2017-2018", templates: ["more file", "yaas"] },
    {
      name: "folderrrrr",
      templates: ["computer science 1", "biology and cs "],
    },
  ];

  return (
    <Container>
      <Search
        placeholder="Search by major name"
        onEnter={setSearchQuery}
        isSmall={false}
      />
      <TemplatesContainer>
        <TemplateListContainer>
          <ButtonWrapper>
            <WhiteColorButton> Upload Plan </WhiteColorButton>
            <ColorButton onClick={() => setPageState(TemplatePageState.NEW)}>
              Create New
            </ColorButton>
          </ButtonWrapper>
          <TemplateListScrollContainer>
            {folders.map((folder: Folder, index: number) => (
              <FolderComponent index={index} folder={folder} />
            ))}
          </TemplateListScrollContainer>
        </TemplateListContainer>
      </TemplatesContainer>
    </Container>
  );
};

const FolderComponent: React.FC<FolderProps> = (props: FolderProps) => {
  const { index, folder } = props;
  const isExpanded = useSelector((state: AppState) =>
    getFolderExpandedFromState(state, index)
  );
  const dispatch = useDispatch();

  return (
    <div>
      <FolderNameWrapper>
        <div
          onClick={() => {
            dispatch(toggleTemplateFolderExpandedAction(index));
          }}
          style={{ marginRight: 4 }}
        >
          {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </div>
        <FolderName> {folder.name} </FolderName>
      </FolderNameWrapper>
      <FolderTemplateListContainer>
        {isExpanded &&
          folder.templates.map((template: string) => (
            <Template name={template} />
          ))}
      </FolderTemplateListContainer>
    </div>
  );
};

const Template: React.FC<TemplateProps> = (props: TemplateProps) => {
  const { name } = props;
  return <TemplateName> {name} </TemplateName>;
};
