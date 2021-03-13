import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "../../components/common/Search";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import styled from "styled-components";
import { LinearProgress, Modal, TextField } from "@material-ui/core";
import {
  ICreateTemplatePlan,
  IFolderData,
  ITemplatePlan,
} from "../../models/types";
import {
  createTemplate,
  getTemplates,
  TemplatesAPI,
} from "../../services/TemplateService";
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
import { ExcelWorkbookUpload } from "../../components/ExcelUpload";
import { Schedule } from "../../../../common/types";
import { Autocomplete } from "@material-ui/lab";
import { convertToDNDSchedule } from "../../utils";

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

const InnerSection = styled.section`
  position: fixed;
  background: white;
  width: 30%;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  padding-bottom: 24px;
  min-width: 300px;
`;

interface PlanUploadPopperProps {
  userId: number;
  visible: boolean;
  folders: IFolderData[];
  setTemplates: (templates: IFolderData[]) => void;
  fetchTemplates: (currentFolders: IFolderData[], page: number) => void;
}

interface PlanUploadPopperErrorState {
  noFolderSelectedError: string;
}

interface TemplatesListProps {
  searchQuery: string;
}

interface TemplateProps {
  name: string;
  id: number;
}

interface FolderProps {
  index: number;
  folder: IFolderData;
  searchQuery: string;
}

const EMPTY_TEMPLATES_LIST: IFolderData[] = [];

const PlanUploadPopper: React.FC<PlanUploadPopperProps> = ({
  userId,
  visible,
  folders,
  setTemplates,
  fetchTemplates,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [namedSchedules, setNamedSchedules] = useState<
    [string, Schedule][] | null
  >(null);
  // const [errorState, setErrorState] = useState<PlanUploadPopperErrorState>({
  //   noFolderSelectedError: "",
  // });

  // Errors:
  // - no folder selected
  // - invalid folder selected
  // - failed to convert schedules

  const namedScheduleToCreateTemplatePlan = useCallback(
    ([name, schedule]: [string, Schedule]): ICreateTemplatePlan => {
      const [dndSchedule, courseCounter] = convertToDNDSchedule(schedule, 0);

      return {
        name,
        schedule: dndSchedule,
        catalog_year: null, // TODO do we need optional inputs for these?
        major: null,
        coop_cycle: null,
        concentration: null,
        folder_id: selectedFolderId,
        folder_name:
          folders.find(value => value.id === selectedFolderId)?.name || null,
        course_counter: courseCounter,
      };
    },
    [folders, selectedFolderId]
  );

  const createTemplatesFromNamedSchedules = useCallback(async () => {
    if (!namedSchedules) {
      return;
      // TODO error handling
    }

    await Promise.all(
      namedSchedules.map(namedSchedule =>
        createTemplate(userId, namedScheduleToCreateTemplatePlan(namedSchedule))
      )
    );

    setTemplates(EMPTY_TEMPLATES_LIST);
    fetchTemplates(EMPTY_TEMPLATES_LIST, 0);
  }, [
    fetchTemplates,
    namedScheduleToCreateTemplatePlan,
    namedSchedules,
    setTemplates,
    userId,
  ]);

  const onImportClick = async () => {
    await createTemplatesFromNamedSchedules();
  };

  return (
    <Modal
      style={{ outline: "none" }}
      open={visible}
      onClose={() => {}}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <InnerSection>
        <Autocomplete
          disableListWrap
          options={folders}
          getOptionLabel={folder => folder.name}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              label="Select a destination folder"
              fullWidth
              // error={""}
              // helperText={error && REQUIRED_FIELD_MESSAGE}
            />
          )}
          onChange={(e, value) => setSelectedFolderId(value ? value.id : value)}
        ></Autocomplete>
        <ExcelWorkbookUpload setNamedSchedules={setNamedSchedules} />
        <RedColorButton onClick={onImportClick}>Import</RedColorButton>
      </InnerSection>
    </Modal>
  );
};

export const TemplatesListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Container>
      <Search
        placeholder="Search by template or folder name"
        onEnter={setSearchQuery}
        isSmall={false}
      />
      <TemplatesContainer>
        <TemplateListContainer>
          <ButtonWrapper>
            <WhiteColorButton style={{ marginRight: "20px" }}>
              {" "}
              Upload Plan{" "}
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
    </Container>
  );
};

const TemplatesList = ({ searchQuery }: TemplatesListProps) => {
  const [templates, setTemplates] = useState(EMPTY_TEMPLATES_LIST);
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
    setTemplates(EMPTY_TEMPLATES_LIST);
    fetchTemplates(EMPTY_TEMPLATES_LIST, 0);
  }, [searchQuery]);

  return (
    <>
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
            <FolderComponent
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
            <Template name={template.name} id={template.id} />
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
