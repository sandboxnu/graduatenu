import { fetchAndTokenizeHTML } from "../tokenize/tokenize";
import { addTypeToUrl } from "../classify/classify";
import { scrapeMajorLinks } from "../urls/urls";
import { CatalogEntryType, TypedCatalogEntry } from "../classify/types";
import { Err, Major2, Ok, ResultType, Section } from "@graduate/common";
import {
  ParsedCatalogEntry,
  Pipeline,
  StageLabel,
  TokenizedCatalogEntry,
} from "./types";
import { createAgent } from "./axios";
import {
  installGlobalStatsLogger,
  logProgress,
  logResults,
  clearGlobalStatsLogger,
} from "./logger";
import { HRow, HRowType, HSectionType, TextRow } from "../tokenize/types";
import { parseRows } from "../parse/parse";
import { writeFile } from "fs/promises";
import { saveComment } from "./saveComment";

/**
 * Runs a full scrape of the catalog, logging the results to the console.
 * Currently, does nothing with the output. To run from cli, run `yarn scrape`
 * in `scrapers-v2` dir. Also see `main.ts`.
 */
export const runPipeline = async (yearStart: number, yearEnd: number) => {
  const unregisterAgent = createAgent();
  const { entries, unfinished } = await scrapeMajorLinks(yearStart, yearEnd);
  const comments = new Map();
  // const { entries, unfinished } = {
  //   entries: [new URL("https://catalog.northeastern.edu/archive/2021-2022/undergraduate/science/linguistics/linguistics-english-ba/")],
  //   unfinished: []
  // };
  if (unfinished.length > 0) {
    console.log("didn't finish searching some entries", ...unfinished);
  }

  // const entries = [new URL("https://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/bscs/")]

  // can use for debugging logging throughout the stages
  installGlobalStatsLogger();
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
      .then(addPhase(StageLabel.Tokenize, tokenizeEntry))
      .then(addPhase(StageLabel.SaveComment, saveComment, comments))
      .then(addPhase(StageLabel.Parse, parseEntry))
      .then(addPhase(StageLabel.Save, saveResults));
  });
  const results = await logProgress(pipelines);
  await unregisterAgent();

  const obj: { [key: string]: number } = {};
  Array.from(comments.entries())
    .sort((a, b) => -a[1].length + b[1].length)
    .forEach(([key, value]) => (obj[key] = value));
  writeFile("./results/comments.json", JSON.stringify(obj, null, 2));
  logResults(results);
  clearGlobalStatsLogger();
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

const tokenizeEntry = async (
  entry: TypedCatalogEntry
): Promise<TokenizedCatalogEntry> => {
  const tokenized = await fetchAndTokenizeHTML(entry.url);
  return { ...entry, tokenized };
};

const parseEntry = async (
  entry: TokenizedCatalogEntry
): Promise<ParsedCatalogEntry> => {
  const nonConcentrations = entry.tokenized.sections.filter((metaSection) => {
    return metaSection.type === HSectionType.PRIMARY;
  });

  const entries: HRow[][] = nonConcentrations.map((metaSection) => {
    if (
      metaSection.entries.length >= 1 &&
      metaSection.entries[0].type != HRowType.HEADER
    ) {
      const newHeader: TextRow<HRowType.HEADER> = {
        type: HRowType.HEADER,
        description: metaSection.description,
        hour: 0,
      };
      metaSection.entries = [newHeader, ...metaSection.entries];
    }
    return metaSection.entries;
  });

  let allEntries = entries.reduce((prev: HRow[], current: HRow[]) => {
    return prev.concat(current);
  }, []);

  allEntries = allEntries.filter(
    (row) => row.type !== HRowType.COMMENT && row.type !== HRowType.SUBHEADER
  );

  const mainReqsParsed = parseRows(allEntries);

  const concentrations = entry.tokenized.sections
    .filter((metaSection) => {
      return metaSection.type === HSectionType.CONCENTRATION;
    })
    .map((concentration): Section => {
      // Add in header based on section name if one isn't already present.
      concentration.entries = concentration.entries.filter(
        (row) =>
          row.type !== HRowType.COMMENT && row.type !== HRowType.SUBHEADER
      );
      if (
        concentration.entries.length >= 1 &&
        concentration.entries[0].type != HRowType.HEADER
      ) {
        const newHeader: TextRow<HRowType.HEADER> = {
          type: HRowType.HEADER,
          description: concentration.description,
          hour: 0,
        };
        concentration.entries = [newHeader, ...concentration.entries];
      }
      const parsed = parseRows(concentration.entries);
      if (parsed.length === 1 && parsed[0].type == "SECTION") {
        return parsed[0];
      } else {
        throw new Error(
          `Concentration "${concentration.description}" cannot be parsed!`
        );
      }
    });

  const major: Major2 = {
    name: entry.tokenized.majorName,
    totalCreditsRequired: entry.tokenized.programRequiredHours,
    yearVersion: entry.tokenized.yearVersion,
    requirementSections: mainReqsParsed,
    concentrations: {
      minOptions: concentrations.length >= 1 ? 1 : 0, // Is there any case where this isn't 0 or 1?
      concentrationOptions: concentrations,
    },
  };

  return {
    url: entry.url,
    type: entry.type,
    parsed: major,
  };
};

const saveResults = async (
  entry: ParsedCatalogEntry
): Promise<ParsedCatalogEntry> => {
  const name = entry.parsed.name;
  const degree = name.includes("Minor") ? "minor" : "major";
  const filePath = `./results/${degree}/${name}/parsed.json`;
  return writeFile(filePath, JSON.stringify(entry.parsed, null, 2))
    .then(() => {
      // console.log("wrote file: " + path)
      return entry;
    })
    .catch((e) => {
      console.log(e);
      return entry;
    });
};
