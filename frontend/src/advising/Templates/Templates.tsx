import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { NewTemplatesPage } from "./NewTemplatesPage";
import { TemplatesListPage } from "./TemplateListPage";

export interface TemplateProps {
  name: string;
}

interface TemplatesAPI {
  templates: TemplateProps[];
  nextPage: number;
  lastPage: boolean;
}

interface TemplatesListProps {
  searchQuery: string;
}

export enum TemplatePageState {
  LIST = "LIST",
  NEW = "NEW",
}

const TemplatesPageComponent: React.FC = (props: any) => {
  const [pageState, setPageState] = useState(TemplatePageState.LIST);

  return pageState === TemplatePageState.LIST ? (
    <TemplatesListPage setPageState={setPageState} />
  ) : (
    <NewTemplatesPage setPageState={setPageState} />
  );
};

export const TemplatesPage = withRouter(TemplatesPageComponent);
