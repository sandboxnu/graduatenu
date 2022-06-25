for this project we are using NearleyJS to parse.

the definition of parse is convert a stream of tokens into an AST (abstract syntax tree). this is a programming language concept.

if you look at the Major2 definition (encompassing Requirement2), it looks like a tree (each node can have more nodes, or leafs). where a node is something like a SECTION or an AND, and a leaf is something like a COURSE or a RANGE.

beacuse we already have a tokenize stage, we will be replacing the tokenize part of the parser (which moo requires) with arbitrary token matching. see [here](https://nearley.js.org/docs/tokenizers#custom-token-matchers).

## development

if you need to make updates to the grammar, you may do so by editing the `grammar.ne` file.

to regenerate the parser, run `yarn parser:generate`. other commands are also provided by nearley, see the [tooling page](https://nearley.js.org/docs/tooling) for more information (like how to generate examples matching grammar!).

### wb typescript?

it does have ts support, but it's easier to test it with javascript (the tester only accepts js files). and we don't need types anyway

## todolist

- [x] come up with overall plan impl
  - [x] research library for parsing
  - [x] proof of concept
- [ ] comment parser
  - [ ] aggregate comment data from recording
  - [ ] section comments
  - [ ] xom comments
  - note: here might need info of whether hour is null or 0. maybe impl?
- [ ] major2 parser
  - [x] base cases
  - [ ] recursive cases
  - [ ] test it out + fix bugs
  - [ ] recursive cases with comments
  - [ ] more testing
  - [ ] connect to pipeline pipeline
  - [ ] aggregate metrics and impl sanity checks
  - [ ] more bugfixing

## strategy

grammar -> how does it actually parse?

have a stage for parsing comments -> recognize how it's going to be parsed. do we need comment types?

- HEADER
- SUBHEADER
- COMMENT
- OR_COURSE
- AND_COURSE
- OR_OF_AND_COURSE
- PLAIN_COURSE
- RANGE_LOWER_BOUNDED
- RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS
- RANGE_BOUNDED
- RANGE_BOUNDED_WITH_EXCEPTIONS
- RANGE_UNBOUNDED

grammar in regex notation:

- ICourseRange2
  - exactly matches a range case
- IRequiredCourse
  - exactly matches a course case
- IAndCourse2
  - (requirement)(AND_COURSE)+
  - note: need to make sure this captures the max # of ANDs (avoid nested case parsing backwards)
- IOrCourse2
  - (requirement)(OR_COURSE|OR_OF_AND_COURSE)+
  - note: need to also parse the inner AND, but should be simple
- IXofManyCourse (min # of credits)
  - xofmany comment? "take at least 3 credits" or use as fallback with creditHours column
- Section (min # of requirements)
  - section comment -> "take at least 3 of the following"
  - (section comment)(requirement)+
- what is a delimiter? comment? or header? subheader?
  - probably review this after writing first bit and testing

# nearley learnings

- [as a generator](http://humans-who-read-grammars.blogspot.com/2018/04/having-fun-with-phrase-structure.html)
- [learning nearley medium article](https://gajus.medium.com/parsing-absolutely-anything-in-javascript-using-earley-algorithm-886edcc31e5e)
-

## takeaways after proof of concept (nearley)

- managing types are a huge pain, because we don't get types from nearley
  - having to write the parse functions without type safety is awful
- how do we split RANGEs? maybe add an intermediary stage wouldn't be too bad actually
- generates very nicely, and is easy to specify the parse transitions (left recursive automatically)
