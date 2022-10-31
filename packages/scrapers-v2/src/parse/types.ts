import { HRow, HRowType } from "../tokenize/types";
import { Requirement2 } from "@graduate/common";

/*
# optimizing for solver: choosing XOM vs SECTION vs AND

ideally we want to preserve the order of courses as they were in the course catalog
this way, students won't get confused when looking at our representation and comparing the two

this solution must be recursive, bottom up
we may need to do some dynamic programming to avoid calculating required hours more than once

basic strategy for deciding XOM vs SECTION vs AND, is
this is a later problem. for now, treat everything with hours as an XOM

# concentrations

separate out the sections that contain "concentration" in the name, as those are concentrations
later: need to "remember" the paragraph of text after headers containing "concentration" and do analysis to decide
the required # of concentrations. 
 */

// grab the wrapper of the row type enum from tokenize types
export type GetRow<RowType> = HRow & { type: RowType };
// sometimes produces a list, if a row token maps to multiple requirements
export type Processor<RowType> = (
  tokens: [GetRow<RowType>]
) => Requirement2 | Requirement2[];

export type SimpleRequirement =
  | GetRow<HRowType.AND_COURSE>
  | GetRow<HRowType.PLAIN_COURSE>
  | GetRow<HRowType.OR_COURSE>
  | GetRow<HRowType.RANGE_LOWER_BOUNDED>
  | GetRow<HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS>
  | GetRow<HRowType.RANGE_BOUNDED>
  | GetRow<HRowType.RANGE_BOUNDED_WITH_EXCEPTIONS>
  | GetRow<HRowType.RANGE_UNBOUNDED>;

export type ParseMain = {
  leadingComments: GetRow<HRowType.COMMENT>[];
  leadingRequirements: Requirement2[];
};
