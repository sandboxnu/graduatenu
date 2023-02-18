@{%
// define custom tokens
// basically just check against the HRowType enum value
const HEADER = { test: x => x.type === "HEADER" };
const SUBHEADER = { test: x => x.type === "SUBHEADER" };
const COMMENT = { test: x => x.type === "COMMENT" };
const SECTION_INFO = { test: x => x.type === "SECTION_INFO" };

const OR_COURSE = { test: x => x.type === "OR_COURSE" };
const OR_OF_AND_COURSE = { test: x => x.type === "OR_OF_AND_COURSE" };

const AND_COURSE = { test: x => x.type === "AND_COURSE" };

const PLAIN_COURSE = { test: x => x.type === "PLAIN_COURSE" };
const RANGE_LOWER_BOUNDED = { test: x => x.type === "RANGE_LOWER_BOUNDED" };
const RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS = { test: x => x.type === "RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS" };
const RANGE_BOUNDED = { test: x => x.type === "RANGE_BOUNDED" };
const RANGE_BOUNDED_WITH_EXCEPTIONS = { test: x => x.type === "RANGE_BOUNDED_WITH_EXCEPTIONS" };
const RANGE_UNBOUNDED = { test: x => x.type === "RANGE_UNBOUNDED" };

const X_OF_MANY = { test: x => x.type === "X_OF_MANY" };
%}

@{%
// import postprocessors
const mt = () => [];
const cons = ([first, rest]) => [first, ...rest];
const postprocess = require("./postprocess");
%}

# main entrypoint
main -> requirement2_section:+                             {% id %}

# sections!
requirement2_section ->
    %HEADER top_level_requirement2_list                {% postprocess.processSection %}
  | %HEADER %SECTION_INFO top_level_requirement2_list  {% postprocess.processSectionWithInfo %}

xom -> 
  %X_OF_MANY requirement2_list                           {% postprocess.processXOM %}

## XOMs must be at the top-level of a section
top_level_requirement2_list ->
    requirement2_list xom:+                                {% tokens => tokens.flat() %}
  | requirement2_list                                      {% id %}

## to avoid ambiguity, ANDs cannot follow ANDs
requirement2_list ->
    nonAndCourseList                                       {% id %}
  | andCourse nonAndCourseList                             {% cons %}
nonAndCourseList ->
    null                                                   {% mt %}
  | (course | range | orCourse) requirement2_list          {% cons %}

# requirement2 ->
#     orCourse                                               {% id %}
#   | andCourse                                              {% id %}
#   | course                                                 {% id %}
#   | range                                                  {% id %}

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

# comment cases