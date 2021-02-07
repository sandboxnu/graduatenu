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
      if (diff < 0) {
        return -1;
      }
      if (diff > 0) {
        return 1;
      } else {
        return 0;
      }
    }
  );
