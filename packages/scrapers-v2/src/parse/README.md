# parse

the definition of parse (PL) is to convert a stream of tokens into an AST (abstract syntax tree).

in our case, we are parsing program requirement table rows (our "tokens") into major2 (AST).

if you look at the Major2 definition (encompassing Requirement2), it looks like a tree (each node can have more nodes, or leafs). where a node is something like a SECTION or an AND, and a leaf is something like a COURSE or a RANGE.

for this stage we are using [NearleyJS](https://nearley.js.org/) to parse.

## intro

this assumes the reader is somewhat familiar with regex.

concretely, a parser allows you to specify a "grammar" for your tokens (think of a grammar as a list of rules). these rules are specified in a very similar way to a regular expression.

in nearley, we can write a rule: `greeting -> %HELLO _ %THERE`, which defines `greeting` to be a series of three tokens, where the first is HELLO and the last is THERE (\_ colloquially means whitespace). we can then provide a JS function to convert the matched tokens into our AST.

similar to regex, you can also use the `?`, `\*`, and `+` symbols to match multiple tokens, or indicate optional-ness.

at a high level, nearley allows us to just specify a bunch of rules, and then builds a parser from them to convert tokens -> AST.

nearley has its own syntax and file extension for specifying rules. we then use the nearley compiler `nearleyc` to process the grammar and generate a parser. the resulting `.js` file we then use in the `parse.ts` file for parsing.

## development

we are using the "arbitrary token matching" feature of nearley. see [here](https://nearley.js.org/docs/tokenizers#custom-token-matchers).

if you need to make updates to the grammar, you may do so by editing the `grammar.ne` file.

to regenerate the parser, run `yarn parser:generate`. other commands are also provided by nearley, see the [tooling page](https://nearley.js.org/docs/tooling) for more information (like how to generate examples matching grammar!).

wb typescript? it does have ts support, but it's easier to test it with javascript (the tester only accepts js files). and we don't need types anyway

## strategy

high-level grammar (in regex notation):

- ICourseRange2
  - exactly matches a range case
- IRequiredCourse
  - exactly matches a course case
- IAndCourse2
  - `(requirement)(AND_COURSE)+`
  - note: need to make sure this captures the max # of ANDs (avoid nested case parsing backwards)
- IOrCourse2
  - `(requirement)(OR_COURSE|OR_OF_AND_COURSE)+`
  - note: need to also parse the inner AND, but should be simple
- IXofManyCourse (min # of credits)
  - xofmany comment? "take at least 3 credits" or use as fallback with creditHours column
  - `(xom comment)(requirement)+(delimiter)`
- Section (min # of requirements)
  - section comment -> "take at least 3 of the following"
  - `(section comment)(requirement)+(delimiter)`
- what is a delimiter? comment? or header? subheader?
  - probably review this after writing first bit and testing

## nearley learnings

- [as a generator](http://humans-who-read-grammars.blogspot.com/2018/04/having-fun-with-phrase-structure.html)
- [learning nearley medium article](https://gajus.medium.com/parsing-absolutely-anything-in-javascript-using-earley-algorithm-886edcc31e5e)

alex guide to nearley syntax

- nearley EBNF seems to slightly differ from the wikipedia article, which is sadge. lean on the [examples](https://github.com/kach/nearley/blob/master/examples/fun-lang.ne) a lot.
- as far as i can tell, `:?` `:+` and `:*` mean the same thing as their regexp counterparts, and all modify how many times a matcher is applied
- the order of binding/operations is as follows:
  - the `:?`... operators
  - tokens next to each other
  - parentheses (construct a group)
  - apply post process function
  - the `|` (union) operator
- for each rule, all the matched tokens are passed to the post process function as the first argument via an array
- in the rule `example -> TEST _ TEST {% processTest %}`, processTest would receive an array of three elements, the first being whatever matched TEST, the second \_, and etc.
- in the rule `example -> TEST:+ _ TEST`, the post process function would still receive a single array of three items, but the first item would be a list of the one or more things that TEST matched.
- for each result, the parser will produce an array of the possible parsings of the provided tokens. this should usually be a list of one item, but it may be more.

# ALEX DEVELOPMENT NOTES DELETE LATER

## todolist

- [x] come up with overall plan impl
  - [x] research library for parsing
  - [x] proof of concept
- [ ] comment parser
  - [x] aggregate comment data from recording
  - [ ] section comments
  - [ ] xom comments
  - note: here might need info of whether hour is null or 0. maybe impl?
- [ ] major2 parser
  - [x] base cases
  - [x] recursive cases
  - [x] test it out + fix bugs
  - [ ] recursive cases with comments
  - [ ] more testing
  - [ ] connect to pipeline pipeline
  - [ ] aggregate metrics and impl sanity checks
  - [ ] more bugfixing

## takeaways after proof of concept (nearley)

- managing types are a huge pain, because we don't get types from nearley
  - having to write the parse functions without type safety is awful
- how do we split RANGEs? maybe add an intermediary stage wouldn't be too bad actually
- generates very nicely, and is easy to specify the parse transitions (left recursive automatically)
- we should potentially modify the range definitions to account for high/low courseId instead of using 0-9999

## notes for comment implementation later on

- if it doesn't have an hour column, then can probably ignore it
- vast majority of COMMENT rows are a type of SECTION or XOM limit specifier ("complete <n> of the following", etc)
- some headers and subheaders are requirements, themselves
  - Students must complete nine elective courses in the SOCL major, at least five of which must be at the 3000-level or higher | `36`
    - this one should actually be a RANGE (as a header)
- and others are XOM/SECTION limit specifiers:
  - Electives (select 4, at least 3 at 3000 level or higher): | `16`
  - Complete two of the following: | `???`
- we should probably have a "label" or "comment" metadata for requirements

## transitions

- PLAIN_COURSE -> OR_COURSE 969
- PLAIN_COURSE -> OR_OF_AND_COURSE 5
- AND_COURSE -> OR_COURSE 16
- AND_COURSE -> OR_OF_AND_COURSE 7
- OR_COURSE -> OR_COURSE 180
- OR_COURSE -> OR_OF_AND_COURSE 4
- OR_OF_AND_COURSE -> OR_COURSE 5

- PLAIN_COURSE -> PLAIN_COURSE 15350
- COMMENT -> PLAIN_COURSE 1922
- PLAIN_COURSE -> HEADER 1890
- HEADER -> COMMENT 1836
- HEADER -> PLAIN_COURSE 1541

- OR_COURSE -> PLAIN_COURSE 536
- SUBHEADER -> PLAIN_COURSE 447
- AND_COURSE -> AND_COURSE 423
- AND_COURSE -> PLAIN_COURSE 406
- PLAIN_COURSE -> SUBHEADER 378
- PLAIN_COURSE -> COMMENT 312
- RANGE_BOUNDED -> RANGE_BOUNDED 298
- PLAIN_COURSE -> AND_COURSE 297
- OR_COURSE -> HEADER 250
- COMMENT -> COMMENT 246
- HEADER -> AND_COURSE 209
- AND_COURSE -> HEADER 183
- COMMENT -> RANGE_BOUNDED 153
- COMMENT -> HEADER 147
- COMMENT -> AND_COURSE 136
- SUBHEADER -> AND_COURSE 91
- COMMENT -> SUBHEADER 79
- SUBHEADER -> COMMENT 78
- RANGE_BOUNDED -> HEADER 65
- AND_COURSE -> SUBHEADER 62
- HEADER -> SUBHEADER 41
- PLAIN_COURSE -> RANGE_BOUNDED 41
- RANGE_BOUNDED -> PLAIN_COURSE 30
- OR_COURSE -> COMMENT 23
- AND_COURSE -> COMMENT 23
- HEADER -> RANGE_BOUNDED 20
- OR_COURSE -> SUBHEADER 19
- OR_COURSE -> AND_COURSE 17

- RANGE_BOUNDED -> SUBHEADER 13
- RANGE_BOUNDED -> COMMENT 9
- SUBHEADER -> RANGE_BOUNDED 4
- OR_OF_AND_COURSE -> AND_COURSE 4
- AND_COURSE -> RANGE_BOUNDED 4

- OR_COURSE -> RANGE_BOUNDED 3
- OR_OF_AND_COURSE -> HEADER 3
- HEADER -> HEADER 2
- OR_OF_AND_COURSE -> COMMENT 2
- SUBHEADER -> HEADER 1
