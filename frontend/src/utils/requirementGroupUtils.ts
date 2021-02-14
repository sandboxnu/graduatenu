import { IMajorRequirementGroup } from "../../../common/types";

const reqGroupSortOrder = ["AND", "OR", "RANGE"];

/**
 * sorts the IMajorRequirementGroups by the group constrain from most to least constrained
 * @param groupMap Mapping of section name to IMajorRequirementGroup validation group
 */
export const sortRequirementGroupsByConstraint = (
  reqGroupArray: IMajorRequirementGroup[]
): IMajorRequirementGroup[] =>
  // Sort the array based on the IMajorRequirementGroup type
  reqGroupArray.sort(
    (first: IMajorRequirementGroup, second: IMajorRequirementGroup): number => {
      const diff =
        reqGroupSortOrder.indexOf(first.type) -
        reqGroupSortOrder.indexOf(second.type);
      // returns 0 if diff 0, -1 if diff negative, and 1 if diff positive
      return Math.min(1, Math.max(-1, diff));
    }
  );
