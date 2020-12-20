import { Button, LinearProgress, Theme, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Search } from "../components/common/Search";
import { NORTHEASTERN_RED } from "../constants";
import { getAuthToken } from "../utils/auth-helpers";
import { connect } from "react-redux";
import { Dispatch } from "redux";

const Container = styled.div`
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 50px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
`;

const TemplatesContainer = styled.div`
  margin-top: 15px;
  border: 1px solid red;
  border-radius: 10px;
  width: auto;
  padding: 20px;
`;

const TemplateListContainer = styled.div`
  width: auto;
  height: 360px;
  height: 50vh;
`;

const TemplateListScrollContainer = styled.div`
  width: auto;
  height: 360px;
  margin: 70px;
  overflow-y: scroll;
  height: 50vh;
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
  padding-top: 20px;
  justify-content: space-between;
  position: relative;
  float: right;
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

const FolderContainer = styled.div``;

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

interface ReduxDispatchTemplateFolderProps {
  toggleTemplateFolderExpanded: (folderIndex: number) => void;
}

const Template = (props: TemplateProps) => {
  return <TemplateContainer>{props.name}</TemplateContainer>;
};

const EMPTY_TEMPLATES_LIST: TemplateProps[] = [];

const TemplatesList = (props: TemplatesListProps) => {
  const [templates, setTemplates] = useState(EMPTY_TEMPLATES_LIST);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const token = getAuthToken();

  const fetchTemplates = (currentTemplates: TemplateProps[], page: number) => {
    setIsLoading(true);
    // get some mock data
    // getTemplates(props.searchQuery, page, token)
    //   .then((TemplatesAPI: TemplatesAPI) => {
    //     setTemplates(currentTemplates.concat(TemplatesAPI.templates));
    //     setPageNumber(TemplatesAPI.nextPage);
    //     setIsLastPage(TemplatesAPI.lastPage);
    //     setIsLoading(false);
    //   })
    //   .catch(err => console.log(err));
  };

  useEffect(() => {
    setTemplates(EMPTY_TEMPLATES_LIST);
    fetchTemplates(EMPTY_TEMPLATES_LIST, 0);
  }, [props.searchQuery, token]);

  return (
    <TemplatesContainer>
      {isLoading ? (
        <Loading>
          <LinearProgress color="secondary" />
        </Loading>
      ) : null}
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
            <LoadMoreTemplates
              onClick={_ => fetchTemplates(templates, pageNumber)}
            >
              Load more Templates
            </LoadMoreTemplates>
          )
        ) : null}
      </TemplateListContainer>
    </TemplatesContainer>
  );
};

type Props = ReduxDispatchTemplateFolderProps;

const TemplatesComponent: React.FC<Props> = (props: any) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Container>
      <TemplatesContainer>
        <Center> Templates </Center>

        <TemplateListContainer>
          <Search
            placeholder="Search by major name"
            onEnter={setSearchQuery}
            isSmall={true}
          />
          <ButtonWrapper>
            <WhiteColorButton> Upload Plan </WhiteColorButton>
            <ColorButton> Create New </ColorButton>
          </ButtonWrapper>
          <TemplateListScrollContainer>
            <p style={{ fontWeight: "bold" }}>Non-shared folder</p>
          </TemplateListScrollContainer>
        </TemplateListContainer>
      </TemplatesContainer>
    </Container>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleTemplateFolderExpanded: (folderIndex: number) => {
    return;
  },
});

export const TemplatesPage = connect<{}, ReduxDispatchTemplateFolderProps>(
  null,
  mapDispatchToProps
)(TemplatesComponent);
