import { fetchAndTokenizeHTML } from "../tokenize/tokenize";
import { addTypeToUrl } from "../classify/classify";
import { scrapeMajorLinks } from "../urls/urls";
import { CatalogEntryType, TypedCatalogEntry } from "../classify/types";
import { Err, Ok, Result, ResultType } from "@graduate/common";

enum Phase {
  Urls = "Urls",
  Flatten = "Flatten",
  Classify = "Classify",
  Filter = "Filter",
  Tokenize = "Tokenize",
}

type Pipeline<T> = {
  trace: Phase[];
  result: Result<T, unknown[]>;
};
const createPipeline = <T>(input: T): Promise<Pipeline<T>> =>
  Promise.resolve({
    trace: [],
    result: Ok(input),
  });

const addPhase =
  <Input extends any[], Output>(
    phase: Phase,
    next: ((...args: Input) => Promise<Output>) | ((...args: Input) => Output)
  ) =>
  async (input: Pipeline<Input>): Promise<Pipeline<[Output]>> => {
    const { trace, result } = input;
    const newTrace = [...trace, phase];
    if (result.type === ResultType.Ok) {
      try {
        // todo: debug why this is not actually catching
        const applied = await next(...result.ok);
        return { trace: newTrace, result: Ok([applied]) };
      } catch (e) {
        return { trace: newTrace, result: Err([e]) };
      }
    }
    return { trace, result };
  };

export const runPipeline = async () => {
  // todo: make this not break when request fails
  const links = await createPipeline<[number, number]>([2021, 2022]).then(
    addPhase(Phase.Urls, scrapeMajorLinks)
  );

  const {
    ok: [{ entries, unfinished }],
  } = unwrap(links);
  // todo: do something with unfinished
  entries.forEach((entry) => {
    createPipeline<[string]>([entry])
      .then(addPhase(Phase.Classify, addTypeToUrl))
      .then(addPhase(Phase.Filter, filterEntryType([CatalogEntryType.Major])))
      .then(addPhase(Phase.Tokenize, tokenizeEntry))
      .then(unwrap);
  });
};

const unwrap = <T>(pipeline: Pipeline<T>): { trace: Phase[]; ok: T } => {
  // todo: log the result => errors if they exist, otherwise result
  const { trace, result } = pipeline;
  if (result.type === ResultType.Ok) {
    // console.log(`successfully scraped all majors! wow :)`);
    return { trace, ok: result.ok };
  } else {
    console.log(`failed to scrape`);
    console.log(`errored on stage: ${trace[trace.length - 1]}`);
    console.log(`had ${result.err.length} errors`);
    for (let i = 0; i < result.err.length; i += 1) {
      console.log(`err # ${i}:`);
      console.log(result.err[i]);
    }
    console.log(`done printing stacktraces`);
    throw new Error("had an error, see above");
  }
};

const filterEntryType =
  (types: CatalogEntryType[]) => (entry: TypedCatalogEntry) => {
    if (types.includes(entry.type)) {
      return entry;
    }
    throw new Error(
      `filtered out, as the type "${entry.type}" does not match one of: "${types}"`
    );
  };

const tokenizeEntry = (entry: TypedCatalogEntry) => {
  return fetchAndTokenizeHTML(entry.url);
};

/*
// code that i would like to write
const singleScrapePipeline = () => {
const [links, failed] = scrapeLinks()
// retry logic?
let done = 0
let total = ???
links.forEach(link => runPipeline(link).then(() => done++);
}

const runPipeline = () => {

}

notes:
- it's probably possible to think about operations in terms of on a single entry
- is it worth it though? perhaps not all operations will be uniform
 */
