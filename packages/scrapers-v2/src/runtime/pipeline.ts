import { fetchAndTokenizeHTML } from "../tokenize/tokenize";
import { addTypeToUrl } from "../classify/classify";
import { scrapeMajorLinks } from "../urls/urls";
import { CatalogEntryType, TypedCatalogEntry } from "../classify/types";
import { Err, Ok, ResultType } from "@graduate/common";
import { Phase, Pipeline } from "./types";
import { createInterceptors } from "./axios";
import { logProgress, logResults } from "./logger";

export const runPipeline = async () => {
  const unregisterAxiosInterceptors = createInterceptors();
  const { entries, unfinished } = await scrapeMajorLinks(2021, 2022);
  if (unfinished.length > 0) {
    console.log("didn't finish searching some entries", ...unfinished);
  }

  const pipelines = entries.map((entry) =>
    createPipeline(entry)
      .then(addPhase(Phase.Classify, addTypeToUrl))
      .then(addPhase(Phase.Filter, filterEntryType, [CatalogEntryType.Major]))
      .then(addPhase(Phase.Tokenize, tokenizeEntry))
  );
  const results = await logProgress(pipelines);
  logResults(results);
  unregisterAxiosInterceptors();
};

const createPipeline = (input: URL): Promise<Pipeline<URL>> => {
  return Promise.resolve({
    id: input,
    trace: [],
    result: Ok(input),
  });
};

const addPhase = <Input, Args extends any[], Output>(
  phase: Phase,
  next:
    | ((...args: [Input, ...Args]) => Promise<Output>)
    | ((...args: [Input, ...Args]) => Output),
  ...args: Args
) => {
  return async (input: Pipeline<Input>): Promise<Pipeline<Output>> => {
    const { id, trace, result } = input;
    if (result.type === ResultType.Err) {
      return { id, trace, result };
    }
    const newTrace = [...trace, phase];
    try {
      const applied = await next(result.ok, ...args);
      return { id, trace: newTrace, result: Ok(applied) };
    } catch (e) {
      return { id, trace: newTrace, result: Err([e]) };
    }
  };
};

const filterEntryType = (
  entry: TypedCatalogEntry,
  types: CatalogEntryType[]
) => {
  if (types.includes(entry.type)) {
    return entry;
  }
  throw new FilterError(entry.type, types);
};

export class FilterError {
  actual;
  allowed;

  constructor(actual: CatalogEntryType, allowed: CatalogEntryType[]) {
    this.actual = actual;
    this.allowed = allowed;
  }
}

const tokenizeEntry = async (entry: TypedCatalogEntry) => {
  const tokenized = await fetchAndTokenizeHTML(entry.url);
  return { ...entry, tokenized };
};
