import { HRowType } from "../tokenize/types";
import { TokenizedCatalogEntry } from "./types";

export const saveComment = (
  comments: Map<string, number>
): ((entry: TokenizedCatalogEntry) => Promise<TokenizedCatalogEntry>) => {
  return async (
    entry: TokenizedCatalogEntry
  ): Promise<TokenizedCatalogEntry> => {
    entry.tokenized.sections.forEach((section) => {
      section.entries.forEach((entry) => {
        if (entry.type === HRowType.COMMENT) {
          comments.set(
            entry.description,
            (comments.get(entry.description) ?? 0) + 1
          );
        }
      });
    });

    return entry;
  };
};
