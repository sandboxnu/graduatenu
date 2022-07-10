import { fetchAndTokenizeHTML } from "../tokenize/tokenize";
import { addTypeToUrl } from "../classify/classify";
import { scrapeMajorLinks } from "../urls/urls";
import { CatalogEntryType, TypedCatalogEntry } from "../classify/types";
import { Err, Ok, ResultType } from "@graduate/common";
import { Pipeline, StageLabel } from "./types";
import { createAgent } from "./axios";
import { logProgress, logResults, StatsLogger } from "./logger";

/**
 * Runs a full scrape of the catalog, logging the results to the console.
 * Currently, does nothing with the output. To run from cli, run `yarn scrape`
 * in `scrapers-v2` dir. Also see `main.ts`.
 */
export const runPipeline = async (yearStart: number, yearEnd: number) => {
  const unregisterAgent = createAgent();
  const { entries, unfinished } = await scrapeMajorLinks(yearStart, yearEnd);
  if (unfinished.length > 0) {
    console.log("didn't finish searching some entries", ...unfinished);
  }

  // can use for debugging logging throughout the stages
  const stats = new StatsLogger();
  const pipelines = entries.map((entry) => {
    return createPipeline(entry)
      .then(addPhase(StageLabel.Classify, addTypeToUrl))
      .then(
        addPhase(StageLabel.Filter, filterEntryType, [
          CatalogEntryType.Minor,
          CatalogEntryType.Major,
          CatalogEntryType.Concentration,
        ])
      )
      .then(addPhase(StageLabel.Tokenize, tokenizeEntry, stats));
  });
  const results = await logProgress(pipelines);
  await unregisterAgent();
  logResults(results);
  stats.print();
};

// convenience constructor for making a pipeline
const createPipeline = (input: URL): Promise<Pipeline<URL>> => {
  return Promise.resolve({
    id: input,
    trace: [],
    result: Ok(input),
  });
};

/**
 * Wraps the provided function with a try/catch so that errors don't break the
 * whole scraper.
 *
 * @param phase The identifier for the stage, to be recorded in pipeline trace.
 * @param next  The function representing this stage. the first argument of this
 *   function must be the primary entry input.
 * @param args  Any additional arguments the stage function requires.
 */
const addPhase = <Input, Args extends any[], Output>(
  phase: StageLabel,
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

const tokenizeEntry = async (entry: TypedCatalogEntry, stats: StatsLogger) => {
  const tokenized = await fetchAndTokenizeHTML(entry.url, stats);
  return { ...entry, tokenized };
};
