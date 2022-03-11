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

  // counterexample
  // (a | b | c) & a, [a, b]
  // generative recursion -> non-structural recursion
  // ((a | b) & (b | d)) & a, [a, b, d]
  // generative recursion -> non0-structural recursion
  // ((a    ) & (b    )) & error -> ideally we pop all the way back to when we used 'a'
  // ((a    ) & (    d)) & error
  // ((  | b) & (    d)) & a -> OK

  // OR we can use a-normal form! above gets transformed into the following:
  // let 1 = a | b
  // let 2 = b | d
  // let 3 = 1 & 2
  // let 4 = a
  // 3 & 4

  // let's say we implement this. what next?
  // => we need errors!
  // what error should we use? probably the deepest one in the ANF expression
  // => also, what is the solution?
  // if the solution is different from the default one, we should display a warning telling student where they will need to override
  // to do this, diff our solution w the default one
  // default: meaning the one the audit uses by default (w/out overrides)
  // => are there other solutions?
  // idk if we'll need this yet

  // but wait! how simple is the anf _really_?
  // ((a & b) | (c & d)) & b
  // let 1 = a & b
  // let 2 = c & d
  // let 3 = 1 | 2
  // let 4 = 3 & b

  // problem! we evaluate 1 and 2, but we should only evaluate 1 _or_ 2
  // solution:
  // And(l, r) -> If((l,true), (true, r), false)
  // Or(l, r)  -> If((l,false), true, (false, r))
  // ((a & b) | (c & d)) & b =>
  // let 1 = (If (a & b) then true else (c & d))
  // let 4 = (If 1 then b else false)
  // transform & of more than 2 items
  // (a & b & c) =>
  // let 1 = if a then b else false
  // let 2 = if 1 then c else false
  //

  // david feedback
  // doesn't seem too complicated?

  // sumit
  // compute all cases, take the intersection.
  // consider all non-intersecting options, permute
  // reach out to Pete Manolios (logic and computation)
});
