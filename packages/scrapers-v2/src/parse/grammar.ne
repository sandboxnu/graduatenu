@{%
// basically just check against the HRowType enum value
const HEADER = { test: x => x.type === "HEADER" };
const SUBHEADER = { test: x => x.type === "SUBHEADER" };
const COMMENT = { test: x => x.type === "COMMENT" };
const OR_COURSE = { test: x => x.type === "OR_COURSE" };
const AND_COURSE = { test: x => x.type === "AND_COURSE" };
const OR_OF_AND_COURSE = { test: x => x.type === "OR_OF_AND_COURSE" };
const PLAIN_COURSE = { test: x => x.type === "PLAIN_COURSE" };
const RANGE_LOWER_BOUNDED = { test: x => x.type === "RANGE_LOWER_BOUNDED" };
const RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS = { test: x => x.type === "RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS" };
const RANGE_BOUNDED = { test: x => x.type === "RANGE_BOUNDED" };
const RANGE_BOUNDED_WITH_EXCEPTIONS = { test: x => x.type === "RANGE_BOUNDED_WITH_EXCEPTIONS" };
const RANGE_UNBOUNDED = { test: x => x.type === "RANGE_UNBOUNDED" };

// const tokenPrint = { literal: "print" };
// const tokenNumber = { test: x => Number.isInteger(x) };
%}

main -> %tokenPrint %tokenNumber ";;"

# parser.feed(["print", 12, ";", ";"]);