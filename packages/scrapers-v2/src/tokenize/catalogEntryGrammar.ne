@{%

// define custom tokens based on CheerioElement type
const buildMatcher = (elemVariant) => ({ test: elem => elem.name === elemVariant });

/* currently in the course catalog, we may see the following elements (with associated counts):
h2 3092
p 2626
table 1807
a 454
h3 334
ul 105
hr 36
dl 28
div 23
pre 15
ol 1
h5 1
*/

// the main ones
const H2 = buildMatcher("h2");
const H3 = buildMatcher("h3");
const H5 = buildMatcher("h5");
const TABLE = buildMatcher("table");

// the ones we don't care about (as much):
const P = buildMatcher("p");
const A = buildMatcher("a");
const UL = buildMatcher("ul");
const HR = buildMatcher("hr");
const DL = buildMatcher("dl");
const DIV = buildMatcher("div");
const PRE = buildMatcher("pre");
const OL = buildMatcher("ol");
%}

@{%
const postprocess = require("./postprocessCatalogEntryHtml");

const mt = () => [];
const cons = ([first, rest]) => [first, ...(rest ? rest : [])];
const flat = ([e]) => e.flat();

// because all nearley postprocessors are simply given a single-argument array of the matching token groups,
// just treat the list of args as the actual args
const apply = (postprocessor) => (args) => postprocessor.apply(null, args);
%}

# main entrypoint
main -> leafList h5:* h3:* h2:*                                                {% apply(postprocess.processHtmlMain) %}

# sometimes has children h3s
h2 -> %H2 leafList h3:*                                                        {% apply(postprocess.processHtmlH2) %}

# never has children h5s
h3 -> %H3 leafList                                                             {% apply(postprocess.processHtmlH3) %}

# only appears in a single catalogEntry as a leading element
h5 -> %H5 leafList                                                             {% apply(postprocess.processHtmlH5) %}

leafList -> leaf:*                                                             {% id %}
leaf ->
    %TABLE                                                                     {% id %}
  | %P                                                                         {% id %}
  | %A                                                                         {% id %}
  | %UL                                                                        {% id %}
  | %HR                                                                        {% id %}
  | %DL                                                                        {% id %}
  | %DIV                                                                       {% id %}
  | %PRE                                                                       {% id %}
  | %OL                                                                        {% id %}