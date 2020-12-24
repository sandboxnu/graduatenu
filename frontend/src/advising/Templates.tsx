import { Button, LinearProgress, Theme, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Search } from "../components/common/Search";
import { NORTHEASTERN_RED } from "../constants";
import { getAuthToken } from "../utils/auth-helpers";
import { connect, useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AppState } from "../state/reducers/state";
import { getFolderExpandedFromState } from "../state";
import { toggleTemplateFolderExpandedAction } from "../state/actions/advisorActions";

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

const Center = styled.div`
  text-align: center;
  font-size: 24px;
  margin-bottom: 15px;
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

const LoadMoreTemplates = styled.div`
  font-size: 10px;
  line-height: 21px;
  margin: 10px;
  color: red;
  &:hover {
    text-decoration: underline;
  }
  cursor: pointer;
`;

const NoMoreTemplates = styled.div`
  font-size: 10px;
  line-height: 21px;
  margin: 10px;
  color: red;
`;

const TemplateContainer = styled.div`
  font-size: 18px;
  line-height: 21px;
  padding: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-bottom: 20px;
`;

const WhiteColorButton = withStyles((theme: Theme) => ({
  root: {
    marginRight: "20px",
    border: "1px solid red",
    color: NORTHEASTERN_RED,
    backgroundColor: "#ffffff",
    "&:hover": {
      backgroundColor: "#e9e9e9",
    },
  },
}))(Button);

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: "#ffffff",
    backgroundColor: NORTHEASTERN_RED,
    "&:hover": {
      backgroundColor: "#DB4747",
    },
  },
}))(Button);

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

interface TemplatesListProps {
  searchQuery: string;
}

interface TemplatesAPI {
  templates: TemplateProps[];
  nextPage: number;
  lastPage: boolean;
}

interface TemplateProps {
  name: string;
}

interface FolderProps {
  index: number;
  folder: Folder;
}

interface Folder {
  name: string;
  templates: Array<string>;
}

const EMPTY_TEMPLATES_LIST: TemplateProps[] = [];

const TemplatesList = (props: TemplatesListProps) => {
  const [templates, setTemplates] = useState(EMPTY_TEMPLATES_LIST);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const token = getAuthToken();

  return (
    <TemplatesContainer>
      {isLoading && (
        <Loading>
          <LinearProgress color="secondary" />
        </Loading>
      )}
      <TemplateListContainer>
        {(templates === null || templates.length == 0) && !isLoading ? (
          <EmptyState> No Templates found </EmptyState>
        ) : (
          templates.map(template => <Template name={template.name} />)
        )}
        {!isLoading ? (
          isLastPage ? (
            <NoMoreTemplates>No more Templates</NoMoreTemplates>
          ) : (
            <LoadMoreTemplates onClick={() => {}}>
              Load more Templates
            </LoadMoreTemplates>
          )
        ) : null}
      </TemplateListContainer>
    </TemplatesContainer>
  );
};

type Props = FolderProps;

const TemplatesComponent: React.FC = (props: any) => {
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
            <ColorButton> Create New </ColorButton>
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

export const TemplatesPage = TemplatesComponent;
