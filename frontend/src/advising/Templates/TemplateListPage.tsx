import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "../../components/common/Search";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { WhiteColorButton, ColorButton } from "../GenericAdvisingTemplate";
import styled from "styled-components";
import { LinearProgress } from "@material-ui/core";
import { IFolderData, ITemplatePlan } from "../../models/types";
import { getTemplates, TemplatesAPI } from "../../services/TemplateService";
import {
  getAdvisorUserIdFromState,
  getFolderExpandedFromState,
} from "../../state";
import { toggleTemplateFolderExpandedAction } from "../../state/actions/advisorActions";
import { AppState } from "../../state/reducers/state";
import { getAuthToken } from "../../utils/auth-helpers";
import { TemplatePageState } from "./Templates";

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

interface TemplatesListPageProps {
  setPageState: (state: TemplatePageState) => void;
}

interface TemplatesListProps {
  searchQuery: string;
}

interface TemplateProps {
  name: string;
}

interface FolderProps {
  index: number;
  folder: IFolderData;
}

const EMPTY_TEMPLATES_LIST: IFolderData[] = [];

export const TemplatesListPage: React.FC<TemplatesListPageProps> = ({
  setPageState,
}: TemplatesListPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");

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
            <TemplatesList searchQuery={searchQuery} />
          </TemplateListScrollContainer>
        </TemplateListContainer>
      </TemplatesContainer>
    </Container>
  );
};

const TemplatesList = ({ searchQuery }: TemplatesListProps) => {
  const [templates, setTemplates] = useState(EMPTY_TEMPLATES_LIST);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const token = getAuthToken();
  const { userId } = useSelector((state: AppState) => ({
    userId: getAdvisorUserIdFromState(state),
  }));

  const fetchTemplates = (currentFolders: IFolderData[], page: number) => {
    setIsLoading(true);
    getTemplates(searchQuery, page, userId, token)
      .then((response: TemplatesAPI) => {
        setTemplates(currentFolders.concat(response.templates));
        setPageNumber(response.nextPage);
        setIsLastPage(response.lastPage);
        setIsLoading(false);
      })
      .catch((err: any) => console.log(err));
  };

  useEffect(() => {
    setTemplates(EMPTY_TEMPLATES_LIST);
    fetchTemplates(EMPTY_TEMPLATES_LIST, 0);
  }, [searchQuery, token]);

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
          templates.map((folder, i) => (
            <FolderComponent index={i} folder={folder} />
          ))
        )}
        {!isLoading ? (
          isLastPage ? (
            <NoMoreTemplates>No more Templates</NoMoreTemplates>
          ) : (
            <LoadMoreTemplates
              onClick={() => fetchTemplates(templates, pageNumber)}
            >
              Load more Templates
            </LoadMoreTemplates>
          )
        ) : null}
      </TemplateListContainer>
    </TemplatesContainer>
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
          folder.templatePlans.map((template: ITemplatePlan) => (
            <Template name={template.name} />
          ))}
      </FolderTemplateListContainer>
    </div>
  );
};

const Template: React.FC<TemplateProps> = (props: TemplateProps) => {
  const { name } = props;
  return <TemplateName> {name} </TemplateName>;
};
