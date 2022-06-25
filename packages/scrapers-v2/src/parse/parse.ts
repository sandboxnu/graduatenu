import { CompiledRules, Grammar, Parser } from "nearley";

// at runtime, generate the ./grammar.ts file from the grammar.ne file
// eslint-disable-next-line @typescript-eslint/no-var-requires
const grammar: CompiledRules = require("./grammar");
// declare const grammar: CompiledRules;

const parser = new Parser(Grammar.fromCompiled(grammar));

parser.feed("");
// parser.results is an array of possible results
