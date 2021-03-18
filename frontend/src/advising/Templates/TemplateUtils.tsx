import { IFolderData, ITemplatePlan } from "../../models/types";

export const isSearchedTemplate = (
  template: ITemplatePlan,
  folder: IFolderData,
  searchQuery: string
) => {
  return (
    template.name.includes(searchQuery) || folder.name.includes(searchQuery)
  );
};
