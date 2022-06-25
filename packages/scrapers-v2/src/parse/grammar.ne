@{%
// define custom tokens
// basically just check against the HRowType enum value
const HEADER = { test: x => x.type === "HEADER" };
const SUBHEADER = { test: x => x.type === "SUBHEADER" };
const COMMENT = { test: x => x.type === "COMMENT" };

const OR_COURSE = { test: x => x.type === "OR_COURSE" };
const OR_OF_AND_COURSE = { test: x => x.type === "OR_OF_AND_COURSE" };

const AND_COURSE = { test: x => x.type === "AND_COURSE" };

const PLAIN_COURSE = { test: x => x.type === "PLAIN_COURSE" };
const RANGE_LOWER_BOUNDED = { test: x => x.type === "RANGE_LOWER_BOUNDED" };
const RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS = { test: x => x.type === "RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS" };
const RANGE_BOUNDED = { test: x => x.type === "RANGE_BOUNDED" };
const RANGE_BOUNDED_WITH_EXCEPTIONS = { test: x => x.type === "RANGE_BOUNDED_WITH_EXCEPTIONS" };
const RANGE_UNBOUNDED = { test: x => x.type === "RANGE_UNBOUNDED" };
%}

@{%
// import postprocessors
const postprocess = require("./postprocess");
%}

# main entrypoint
main -> requirement2 :+                               {% id %}
requirement2 ->
    orCourse {% id %}
  | andCourse {% id %}
  | course {% id %}
  | range {% id %}

course -> %PLAIN_COURSE                               {% id %}
range ->
    %RANGE_LOWER_BOUNDED {% id %}
  | %RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS {% id %}
  | %RANGE_BOUNDED {% id %}
  | %RANGE_BOUNDED_WITH_EXCEPTIONS {% id %}
  | %RANGE_UNBOUNDED                                  {% id %}

# an OR always follows a plainCourse or andCourse
orCourse ->
  (course {% id %} | andCourse {% id %}) (%OR_COURSE {% id %} | %OR_OF_AND_COURSE {% id %}) :+
andCourse -> %AND_COURSE :+