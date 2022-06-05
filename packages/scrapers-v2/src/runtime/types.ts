import { Result } from "@graduate/common";

export enum Phase {
  Urls = "Urls",
  Flatten = "Flatten",
  Classify = "Classify",
  Filter = "Filter",
  Tokenize = "Tokenize",
}

export type Pipeline<T> = {
  trace: Phase[];
  result: Result<T, unknown[]>;
};