import { Result } from "@graduate/common";

/** Represents the label for a stage in the scraper pipeline */
export enum StageLabel {
  Classify = "Classify",
  Filter = "Filter",
  Tokenize = "Tokenize",
  Parse = "Parse",
  Save = "Save"
}

/**
 * Represents a pipeline value, at some point in the scraper pipeline. Contains
 * a trace of the stages that have been run, as well as the resulting value
 * (either an error, or OK), and the URL the pipeline was run on.
 */
export type Pipeline<T> = {
  id: URL;
  trace: StageLabel[];
  result: Result<T, unknown[]>;
};
