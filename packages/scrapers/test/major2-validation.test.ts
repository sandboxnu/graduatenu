import { validateMajor2 } from "frontend/src/utils/major2-validation";

test("simple", () => {
  // case where two of the same course is required, should be false
  // a & a, [a] -> false
  // case where course could be used in two places, but only one produces OK
  // (a | c) & a, [a, c] -> true
  // same as above, but not toplevel and
  // (a | (b & c)) & (a | (b & c)), [a, b, c] -> true
  // (a | b | c | d) & (a | b), [b, d] -> true
  // (a | b | c | d) & (a | b), [b] -> false
  // foundations
  // https://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/bscs/#programrequirementstext
  // (((a & b) | c) & (d | e)) & (d | e)
  // [d, e, c] -> true
  // [d, e, a, b] -> true
  // [d, c] -> false
  // [d, a, b] -> false
});
