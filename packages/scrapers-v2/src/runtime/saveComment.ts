import { HRowType } from "../tokenize/types";
import { TokenizedCatalogEntry } from "./types";

export const saveComment = (
  comments: Map<string, string[]>
): ((major: TokenizedCatalogEntry) => Promise<TokenizedCatalogEntry>) => {
  return async (
    major: TokenizedCatalogEntry
  ): Promise<TokenizedCatalogEntry> => {
    major.tokenized.sections.forEach((section) => {
      section.entries.forEach((entry) => {
        if (entry.type === HRowType.COMMENT) {
          if (!comments.has(entry.description)) {
            comments.set(entry.description, [])
          }
          comments.get(entry.description)?.push(major.tokenized.majorName)
        }
      });
    });

    return major;
  };
};
