import { LinearProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Search } from "../components/common/Search";
import { getAuthToken } from "../utils/auth-helpers";

const Container = styled.div`
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 50px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
`;

const TemplatesListContainer = styled.div`
  margin-top: 15px;
  border: 1px solid red;
  border-radius: 10px;
  width: auto;
  padding: 20px;
`;

const TemplateListScrollContainer = styled.div`
  width: auto;
  height: 360px;
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
    <TemplatesListContainer>
      {isLoading ? (
        <Loading>
          <LinearProgress color="secondary" />
        </Loading>
      ) : null}
      <TemplateListScrollContainer>
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
      </TemplateListScrollContainer>
    </TemplatesListContainer>
  );
};

const TemplatesComponent: React.FC = (props: any) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Container>
      <TemplatesListContainer>
        <Center> Template </Center>

        <TemplateListScrollContainer>
          <Search placeholder="Search by major name" onEnter={setSearchQuery} />
        </TemplateListScrollContainer>
      </TemplatesListContainer>
    </Container>
  );
};

export const TemplatesPage = withRouter(TemplatesComponent);
