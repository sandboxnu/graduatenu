@{%
const { HRowType } = require("../tokenize/types");

/*
general tips:
be as specific as you can at the top level.

adding cases to recursive and repeated rules causes ambiguity (bad)
*/

// define custom tokens
// basically just check against the HRowType enum value
const buildMatcher = (enumVariant) => ({ test: x => x.type === enumVariant });

const INDENT = buildMatcher(HRowType.ROW_INDENT);
const DEDENT = buildMatcher(HRowType.ROW_DEDENT);

const HEADER = buildMatcher(HRowType.HEADER);
const SUBHEADER = buildMatcher(HRowType.SUBHEADER);
const COMMENT = buildMatcher(HRowType.COMMENT);
const COMMENT_COUNT = buildMatcher(HRowType.COMMENT_COUNT);
const COMMENT_HOUR = buildMatcher(HRowType.COMMENT_HOUR);

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
const postprocess = require("./postprocess");
const mt = () => [];
const cons = ([first, rest]) => [first, ...(rest ? rest : [])];
const flat = ([e]) => e.flat();
%}

# main entrypoint
## ranges may produce arrays of requirements, so call flat
# need to make it so that tokens cannot follow other tokens

# note that all %COMMENT indentation is ignored in the tokenize stage
main ->
    %COMMENT :*
  ( %INDENT requirementList %DEDENT
  | requirementList (commentCountGroup :+ | headerGroup :+) :?
  | commentCountHeader headerGroup :+
  )

headerGroup ->
    %HEADER %COMMENT :* 
  ( %INDENT %SUBHEADER :? requirementList %DEDENT
  | requirementList (commentCountGroup :+ | subHeaderGroup :+) :?
  )                                                                            {% ([hd, cm, rest]) => [hd, cm, ...rest] %}

subHeaderGroup ->
    %SUBHEADER %COMMENT :*
  ( (commentCountGroup | requirementList)
  | %INDENT (commentCountGroup | requirementList) %DEDENT
  )                                                                            {% cons %}

commentCountGroup ->
    commentCountHeader %COMMENT :*
  ( (requirementList | subHeaderGroup :+)
  | %INDENT (requirementList | subHeaderGroup :+) %DEDENT
  )                                                                            {% cons %}

commentCountHeader -> %COMMENT_COUNT | %COMMENT_HOUR                           {% id %}

## to avoid ambiguity, ANDs cannot follow ANDs
# is it possible to encode this as a non-empty list?
requirementList -> nestedRequirementList                                       {% ([l]) => l.filter(item => item !== null).flat() %}
nestedRequirementList ->
    null                                                                       {% mt %}
  | andCourse %COMMENT :? null                                                 {% ([a,b,c]) => [a,b] %}
  | andCourse %COMMENT :? nonAndCourse %COMMENT :? nestedRequirementList       {% ([a,b,c,d,e]) => [a,b,c,d, ...e] %}
  | nonAndCourse %COMMENT :? nestedRequirementList                             {% ([a,b,c]) => [a,b,...c] %}

nonAndCourse ->
    course                                                                     {% id %}
  | orCourse                                                                   {% id %}
  | range                                                                      {% id %}

# atoms
course -> %PLAIN_COURSE                                                        {% postprocess.processCourse %}
## unbounded case may produce a list of requirements
range ->
    %RANGE_LOWER_BOUNDED                                                       {% postprocess.processRangeLB %}
  | %RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS                                       {% postprocess.processRangeLBE %}
  | %RANGE_BOUNDED                                                             {% postprocess.processRangeB %}
  | %RANGE_BOUNDED_WITH_EXCEPTIONS                                             {% postprocess.processRangeBE %}
  | %RANGE_UNBOUNDED                                                           {% postprocess.processRangeU %}

# recursive cases
## always begins with a plainCourse or andCourse
orCourse ->
  ( course                                                                     {% id %}
  | %AND_COURSE                                                                {% id %}
  )
  ( %OR_COURSE                                                                 {% postprocess.processCourse %}
  | %OR_OF_AND_COURSE                                                          {% postprocess.processOrOfAnd %}
  ) :+                                                                         {% postprocess.processOr %}
andCourse ->
  ( %AND_COURSE                                                                {% postprocess.processOrOfAnd %}
  ) :+                                                                         {% postprocess.processAnd %}

