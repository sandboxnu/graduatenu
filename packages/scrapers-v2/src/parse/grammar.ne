@{%
const { HRowType } = require("../tokenize/types");

// define custom tokens
// basically just check against the HRowType enum value
const buildMatcher = (enumVariant) => ({ test: x => x.type === enumVariant });

const HEADER = buildMatcher(HRowType.HEADER);
const SUBHEADER = buildMatcher(HRowType.SUBHEADER);
const COMMENT = buildMatcher(HRowType.COMMENT);
const COMMENT_COUNT = buildMatcher(HRowType.COMMENT_COUNT);

const OR_COURSE = buildMatcher(HRowType.OR_COURSE);
const AND_COURSE = buildMatcher(HRowType.AND_COURSE);
const OR_OF_AND_COURSE = buildMatcher(HRowType.OR_OF_AND_COURSE);
const PLAIN_COURSE = buildMatcher(HRowType.PLAIN_COURSE);

const RANGE_LOWER_BOUNDED = buildMatcher(HRowType.RANGE_LOWER_BOUNDED);
const RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS = buildMatcher(HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS);

const RANGE_BOUNDED = buildMatcher(HRowType.RANGE_BOUNDED);
const RANGE_BOUNDED_WITH_EXCEPTIONS = buildMatcher(HRowType.RANGE_BOUNDED_WITH_EXCEPTIONS);

const RANGE_UNBOUNDED = buildMatcher(HRowType.RANGE_UNBOUNDED);
%}

@{%
// import postprocessors
const mt = () => [];
const cons = ([first, rest]) => [first, ...(rest ? rest : [])];
const postprocess = require("./postprocess");
const flat = ([e]) => e.flat();
%}

# main entrypoint
## ranges may produce arrays of requirements, so call flat
# need to make it so that tokens cannot follow other tokens
main ->
  (requirementList commentCountGroup :*)
  | headerGroup :+

# text cases

headerGroup ->
    %HEADER
    %COMMENT :?
  ( requirementList
  | (commentCountGroup | subHeaderGroup) :+
  )                                                        {% ([hd, cm, rest]) => [hd, cm, ...rest] %}

subHeaderGroup ->
  %SUBHEADER (commentCountGroup | requirementList)         {% cons %}

commentCountGroup ->
    %COMMENT_COUNT
  ( requirementList
  | subHeaderGroup :+
  )                                                        {% cons %}


@{%
/*
PROBLEM: when there are subgroups inside of a header, following a comment count, unsure if the subgroups are at the top-level or are within comment count
SOLUTION: look at the indentation of shit -> HTML parser refactoring :(

header -> (commentCountGroup | subheaderGroup) :+
subheaderGroup -> SUBHEADER (commentCountGroup | requirementList)
commentCountGroup -> COMMENT_COUNT (requirementList | subHeaderGroup :+)

header
- commentCountGroup
- subheader
  - commentCountGroup

header
- subheader
  - commentCountGroup
- subheader
  - commentCount
    - subheader
      - requirement list
    - subheader
      - requirement list

headeer
- requirementlist
header
- commentCountGroup
header
- commentCount
  - subheader
    - requirementlist
  - subheader
    - requirementlist

*/
%}

## to avoid ambiguity, ANDs cannot follow ANDs
requirementList -> nestedRequirementList                   {% flat %}
nestedRequirementList ->
    null                                                   {% mt %}
  | andCourse %COMMENT :? null                             {% ([a,b,c]) => [a,b] %}
  | andCourse %COMMENT :? nonAndCourse %COMMENT :? nestedRequirementList           {% ([a,b,c,d,e]) => [a,b,c,d, ...e] %}
  | nonAndCourse %COMMENT :? nestedRequirementList                     {% ([a,b,c]) => [a,b,...c] %}

nonAndCourse ->
    course                                                 {% id %}
  | orCourse                                               {% id %}
  | range                                                  {% id %}

# atoms
course -> %PLAIN_COURSE                                    {% postprocess.processCourse %}
## unbounded case may produce a list of requirements
range ->
    %RANGE_LOWER_BOUNDED                                   {% postprocess.processRangeLB %}
  | %RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS                   {% postprocess.processRangeLBE %}
  | %RANGE_BOUNDED                                         {% postprocess.processRangeB %}
  | %RANGE_BOUNDED_WITH_EXCEPTIONS                         {% postprocess.processRangeBE %}
  | %RANGE_UNBOUNDED                                       {% postprocess.processRangeU %}

# recursive cases
## always begins with a plainCourse or andCourse
orCourse ->
  ( course                                                 {% id %}
  | andCourse                                              {% id %}
  )
  ( %OR_COURSE                                             {% postprocess.processCourse %}
  | %OR_OF_AND_COURSE                                      {% postprocess.processOrOfAnd %}
  ) :+                                                     {% postprocess.processOr %}
andCourse ->
  ( %AND_COURSE                                            {% postprocess.processOrOfAnd %}
  ) :+                                                     {% postprocess.processAnd %}

