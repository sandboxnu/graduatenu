import { CompiledRules, Grammar, Parser } from "nearley";
import { HRow } from "../tokenize/types";

// at runtime, generate the ./grammar.ts file from the grammar.ne file
// eslint-disable-next-line @typescript-eslint/no-var-requires
const grammar: CompiledRules = require("./grammar");

export const parseRows = (rows: HRow[]) => {
  const parser = new Parser(Grammar.fromCompiled(grammar));

  // according to docs, "you would feed a Parser instance an array of objects"
  // https://nearley.js.org/docs/tokenizers#custom-token-matchers
  // however signature only takes string, so cast to any
  parser.feed(rows as any);

  // make sure there are no multiple solutions, as our grammar should be unambiguous
  if (parser.results.length === 0) {
    throw new Error("unexpected end of tokens");
  } else if (parser.results.length === 1) {
    return parser.results[0];
  }
  throw new Error(`${parser.results.length} solutions, grammar is ambiguous`);
};
