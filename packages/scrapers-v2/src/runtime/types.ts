import { Result } from "@graduate/common";

export enum Phase {
  Urls = "Urls",
  Flatten = "Flatten",
  Classify = "Classify",
  Filter = "Filter",
  Tokenize = "Tokenize",
}

export type Pipeline<T> = {
  id: string;
  trace: Phase[];
  result: Result<T, unknown[]>;
};