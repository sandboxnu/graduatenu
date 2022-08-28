import { CompiledRules, Grammar, Parser } from "nearley";
import { ParseHtmlMain } from "./postprocessCatalogEntryHtml";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const catalogEntryGrammmar: CompiledRules = require("./catalogEntryGrammar");

export const parseCatalogEntryHtml = (
  elements: CheerioElement[]
): ParseHtmlMain => {
  const parser = new Parser(Grammar.fromCompiled(catalogEntryGrammmar));

  // according to docs, "you would feed a Parser instance an array of objects"
  // https://nearley.js.org/docs/tokenizers#custom-token-matchers
  // however signature only takes string, so cast to any
  parser.feed(elements as any);

  // make sure there are no multiple solutions, as our grammar should be unambiguous
  if (parser.results.length === 0) {
    throw new Error("unexpected end of tokens");
  } else if (parser.results.length === 1) {
    return parser.results[0];
  }

  // return parser.results;
  throw new Error(`${parser.results.length} solutions, grammar is ambiguous`);
};
