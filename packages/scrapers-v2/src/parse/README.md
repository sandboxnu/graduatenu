for this project we are using NearleyJS to parse.

the definition of parse is convert a stream of tokens into an AST (abstract syntax tree). this is a programming language concept.

if you look at the Major2 definition (encompassing Requirement2), it looks like a tree (each node can have more nodes, or leafs). where a node is something like a SECTION or an AND, and a leaf is something like a COURSE or a RANGE.

## development

if you need to make updates to the grammar, you may do so by editing the `parser.ne` file.

to regenerate the parser, run `yarn nearleyc src/parse/parser.ne -o parser.ts`. other commands are also provided by nearley, see the [tooling page](https://nearley.js.org/docs/tooling) for more information (like how to generate examples matching grammar!).

### wb typescript?

it does have ts support, but it's easier to test it with javascript (the tester only accepts js files). and we don't need types anyway

- [ ] add `grammar.js` to gitignore
- todo

grammar -> how does it actually parse?

have a stage for parsing comments -> recognize how it's going to be parsed
