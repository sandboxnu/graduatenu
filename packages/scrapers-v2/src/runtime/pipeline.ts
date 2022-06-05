import { fetchAndTokenizeHTML } from "../tokenize/tokenize";
import { addTypeToUrl } from "../classify/classify";
import { scrapeMajorLinks } from "../urls/urls";
import { CatalogEntryType, TypedCatalogEntry } from "../classify/types";
import { Err, Ok, ResultType } from "@graduate/common";
import { HDocument } from "../tokenize/types";
import { Phase, Pipeline } from "./types";
import { createInterceptors } from "./axios";

const createPipeline = <T>(input: T): Promise<Pipeline<T>> => {
  return Promise.resolve({
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
    const { trace, result } = input;
    const newTrace = [...trace, phase];
    if (result.type === ResultType.Ok) {
      try {
        const applied = await next(result.ok, ...args);
        return { trace: newTrace, result: Ok(applied) };
      } catch (e) {
        return { trace: newTrace, result: Err([e]) };
      }
    }
    return { trace, result };
  };
};

export const runPipeline = async () => {
  const unregisterAxiosInterceptors = createInterceptors();
  const { entries, unfinished } = await scrapeMajorLinks(2021, 2022);
  // todo: retry logic for unfinished
  if (unfinished.length > 0) {
    console.log("didn't finish searching some entries", ...unfinished);
  }

  const pipelines = entries.map((entry) =>
    createPipeline(entry)
      .then(addPhase(Phase.Classify, addTypeToUrl))
      .then(addPhase(Phase.Filter, filterEntryType, [CatalogEntryType.Major]))
      .then(addPhase(Phase.Tokenize, tokenizeEntry))
  );
  await recordProgress(pipelines);
  unregisterAxiosInterceptors();
};

const filterEntryType = (
  entry: TypedCatalogEntry,
  types: CatalogEntryType[]
) => {
  if (types.includes(entry.type)) {
    return entry;
  }
  throw `filtered out, as the type "${entry.type}" does not match one of: "${types}"`;
};

const tokenizeEntry = (entry: TypedCatalogEntry) => {
  return fetchAndTokenizeHTML(entry.url);
};

const recordProgress = async (
  pipelines: Array<Promise<Pipeline<HDocument>>>
) => {
  // set handlers to log the result of each pipeline
  for (const promise of pipelines) {
    promise.then(({ result, trace }) => {
      // for success log ".", for failure log "<n>" for the stage # that errored (starting at 1)
      if (result.type === ResultType.Ok) {
        process.stdout.write(".");
      } else {
        process.stdout.write(String(trace.length));
      }
    });
  }

  const awaited = await Promise.all(pipelines);
  process.stdout.write("\n");
  const stats = new FieldLogger();

  for (let i = 0; i < awaited.length; i += 1) {
    const { trace, result } = awaited[i];
    if (result.type === ResultType.Ok || typeof result.err[0] === "string") {
      stats.record("status", result.type === ResultType.Ok ? "ok" : "filtered");
      continue;
    }

    stats.record("status", "error");
    stats.record("stage failures", trace[trace.length - 1]);

    for (const err of result.err) {
      if (err instanceof Error) {
        stats.record("errors", err.message);
      } else {
        console.log(err);
        stats.record("errors", "uncategorized");
      }
    }
  }

  stats.print();
};

class FieldLogger {
  private fields: Record<string, Map<any, number>> = {};

  record(field: string, value: any) {
    if (!(field in this.fields)) {
      this.fields[field] = new Map();
    }
    const map = this.fields[field];
    map.set(value, (map.get(value) ?? 0) + 1);
  }

  print() {
    for (const [field, map] of Object.entries(this.fields)) {
      console.log(field, ":");
      const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
      for (const entry of entries) {
        console.log("\t", ...entry);
      }
    }
  }
}
