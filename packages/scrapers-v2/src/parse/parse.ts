import { CompiledRules, Grammar, Parser } from "nearley";
import { HRow } from "../tokenize/types";

// at runtime, generate the ./grammar.ts file from the grammar.ne file
// eslint-disable-next-line @typescript-eslint/no-var-requires
const grammar: CompiledRules = require("./grammar");

export const parseRows = (rows: HRow[]) => {
  const parser = new Parser(Grammar.fromCompiled(grammar));

  // ok according to docs, "you would feed a Parser instance an array of objects"
  // https://nearley.js.org/docs/tokenizers#custom-token-matchers
  parser.feed(rows as any);
  return parser.results;
};

// parser.results is an array of possible results
