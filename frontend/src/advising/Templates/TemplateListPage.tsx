import React, { useState, useEffect, createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "../../components/common/Search";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
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
import { Link, useHistory } from "react-router-dom";
import {
  RedColorButton,
  WhiteColorButton,
} from "../../components/common/ColoredButtons";
import { isSearchedTemplate } from "./TemplateUtils";
import { PlanUploadPopper } from "./PlanUploadPopper";

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
  height: 100%;
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
  margin-left: 23px;
`;

const FolderName = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const TemplateName = styled.div`
  padding: 5px;
  &:hover {
    background-color: #efefef;
    border-radius: 10px;
    cursor: pointer;
  }
`;

interface TemplatesListProps {
  readonly searchQuery: string;
}

interface TemplateProps {
  readonly name: string;
  readonly id: number;
}

interface FolderProps {
  readonly index: number;
  readonly folder: IFolderData;
  readonly searchQuery: string;
}

export interface ITemplateContext {
  readonly templates: IFolderData[];
  readonly isLoading: boolean;
  readonly pageNumber: number;
  readonly isLastPage: boolean;
  readonly fetchTemplates: (currentFolder: IFolderData[], page: number) => void;
}

export const TemplateContext = createContext<Partial<ITemplateContext>>({});

const useTemplatesApi = (searchQuery: string): ITemplateContext => {
  const [templates, setTemplates] = useState<IFolderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const { userId } = useSelector((state: AppState) => ({
    userId: getAdvisorUserIdFromState(state),
  }));

  const fetchTemplates = (currentFolders: IFolderData[], page: number) => {
    setIsLoading(true);
    getTemplates(userId, searchQuery, page)
      .then((response: TemplatesAPI) => {
        setTemplates(currentFolders.concat(response.templates));
        setPageNumber(response.nextPage);
        setIsLastPage(response.lastPage);
        setIsLoading(false);
      })
      .catch((err: any) => console.log(err));
  };

  useEffect(() => {
    setTemplates([]);
    fetchTemplates([], 0);
  }, [searchQuery]);

  return {
    templates,
    isLoading,
    pageNumber,
    isLastPage,
    fetchTemplates,
  };
};

export const TemplatesListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [planUploadModalVisible, setPlanUploadModalVisible] = useState(false);

  const templateContext = useTemplatesApi(searchQuery);

  return (
    <TemplateContext.Provider value={templateContext}>
      <Container>
        <Search
          placeholder="Search by template or folder name"
          onEnter={setSearchQuery}
          isSmall={false}
        />
        <TemplatesContainer>
          <TemplateListContainer>
            <ButtonWrapper>
              <WhiteColorButton
                style={{ marginRight: "20px" }}
                onClick={() => setPlanUploadModalVisible(true)}
              >
                Upload Plans
              </WhiteColorButton>
              <Link
                to={{ pathname: "/advisor/templates/createTemplate" }}
                style={{ textDecoration: "none" }}
              >
                <RedColorButton>Create New</RedColorButton>
              </Link>
            </ButtonWrapper>
            <TemplateListScrollContainer>
              <TemplatesList searchQuery={searchQuery} />
            </TemplateListScrollContainer>
          </TemplateListContainer>
        </TemplatesContainer>
        <PlanUploadPopper
          visible={planUploadModalVisible}
          setVisible={setPlanUploadModalVisible}
        />
      </Container>
    </TemplateContext.Provider>
  );
};

const TemplatesList = ({ searchQuery }: TemplatesListProps) => {
  const {
    templates,
    isLoading,
    pageNumber,
    isLastPage,
    fetchTemplates,
  } = useContext(TemplateContext) as ITemplateContext;

  return (
    <>
      {isLoading && (
        <Loading>
          <LinearProgress color="secondary" />
        </Loading>
      )}
      <TemplateListContainer>
        {(templates === null || templates.length === 0) && !isLoading ? (
          <EmptyState> No Templates found </EmptyState>
        ) : (
          templates.map((folder, i) => (
            <FolderComponent
              key={folder.id}
              index={i}
              folder={folder}
              searchQuery={searchQuery}
            />
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
    </>
  );
};

const FolderComponent: React.FC<FolderProps> = (props: FolderProps) => {
  const { index, folder } = props;
  const isExpanded = useSelector((state: AppState) =>
    getFolderExpandedFromState(state, index)
  );
  const dispatch = useDispatch();

  const filteredTemplatePlans = folder.templatePlans.filter(
    (template: ITemplatePlan) =>
      isSearchedTemplate(template, folder, props.searchQuery)
  );

  return filteredTemplatePlans.length > 0 ? (
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
          filteredTemplatePlans.map((template: ITemplatePlan) => (
            <Template name={template.name} key={template.id} id={template.id} />
          ))}
      </FolderTemplateListContainer>
    </div>
  ) : null;
};

const Template: React.FC<TemplateProps> = ({ name, id }) => {
  const history = useHistory();
  return (
    <TemplateName
      onClick={() => {
        history.push(`/advisor/templates/templateBuilder/${id}`);
      }}
    >
      {name}
    </TemplateName>
  );
};
