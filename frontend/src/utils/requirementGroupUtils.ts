import { IMajorRequirementGroup } from "../../../common/types";

const reqGroupSortOrder = ["AND", "OR", "RANGE"];

/**
 *
 * @param groupMap Mapping of section name to IMajorRequirementGroup validation group
 */
export const sortOnValues = (
  reqGroupArray: IMajorRequirementGroup[]
): IMajorRequirementGroup[] =>
  // Sort the array based on the IMajorRequirementGroup type
  reqGroupArray.sort(
    (first: IMajorRequirementGroup, second: IMajorRequirementGroup): number => {
      const diff =
        reqGroupSortOrder.indexOf(first.type) -
        reqGroupSortOrder.indexOf(second.type);
      return Math.min(-1, Math.max());
    }
  );
