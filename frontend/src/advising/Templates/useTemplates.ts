import { useState, useEffect, createContext, useCallback } from "react";
import { useSelector } from "react-redux";
import { IFolderData } from "../../models/types";
import { getTemplates, TemplatesAPI } from "../../services/TemplateService";
import { getAdvisorUserIdFromState } from "../../state";
import { AppState } from "../../state/reducers/state";

export interface ITemplateContext {
  readonly templates: IFolderData[];
  readonly isLoading: boolean;
  readonly pageNumber: number;
  readonly isLastPage: boolean;
  readonly fetchTemplates: (currentFolder: IFolderData[], page: number) => void;
}

export const TemplateContext = createContext<Partial<ITemplateContext>>({});

export const useTemplatesApi = (searchQuery: string): ITemplateContext => {
  const [templates, setTemplates] = useState<IFolderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const { userId } = useSelector((state: AppState) => ({
    userId: getAdvisorUserIdFromState(state),
  }));

  const fetchTemplates = useCallback(
    (currentFolders: IFolderData[], page: number) => {
      setIsLoading(true);
      getTemplates(userId, searchQuery, page)
        .then((response: TemplatesAPI) => {
          setTemplates(currentFolders.concat(response.templates));
          setPageNumber(response.nextPage);
          setIsLastPage(response.lastPage);
          setIsLoading(false);
        })
        .catch((err: any) => console.log(err));
    },
    [searchQuery, userId]
  );

  useEffect(() => {
    setTemplates([]);
    fetchTemplates([], 0);
  }, [fetchTemplates, searchQuery]);

  return {
    templates,
    isLoading,
    pageNumber,
    isLastPage,
    fetchTemplates,
  };
};
