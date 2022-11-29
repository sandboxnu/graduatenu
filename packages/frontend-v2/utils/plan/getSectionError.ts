import {
  MajorValidationError,
  MajorValidationErrorType,
  MajorValidationResult,
  ResultType,
} from "@graduate/common";

/**
 * Gets the error object for a given section if it exists from the
 * MajorValidationResult object.
 *
 * @param   index            The index of the section
 * @param   validationStatus The result of major validation
 * @returns                  The error for that section or undefined.
 */
export const getSectionError = (
  index: number,
  validationStatus: MajorValidationResult | undefined
): MajorValidationError | undefined => {
  // Find the error for this sidebar component
  if (validationStatus && validationStatus.type == ResultType.Err) {
    // Both these cases should be unreachable, but help to narrow types
    if (!validationStatus.err.majorRequirementsError)
      throw new Error("Top level requirement should have an error.");
    if (
      validationStatus.err.majorRequirementsError.type !==
      MajorValidationErrorType.And.Type
    )
      throw new Error("Top level requirement error should be AND.");

    const andReq = validationStatus.err.majorRequirementsError?.error;
    if (andReq.type == MajorValidationErrorType.And.UnsatChild) {
      return andReq.childErrors.find((error) => {
        return error.childIndex === index;
      });
    } else if (
      andReq.type == MajorValidationErrorType.And.NoSolution &&
      andReq.discoveredAtChild == index
    ) {
      // Create a section error so we don't display a check on the section that
      // caused the "no solution" error.
      return {
        type: "SECTION",
        sectionTitle: "No Solution Section",
        childErrors: [],
        minRequiredChildCount: 0,
        maxPossibleChildCount: 0,
      };
    } else if (andReq.type == MajorValidationErrorType.And.UnsatChildAndNoSolution) {
      if (andReq.noSolution.discoveredAtChild === index) {
        return {
          type: "SECTION",
          sectionTitle: "No Solution Section",
          childErrors: [],
          minRequiredChildCount: 0,
          maxPossibleChildCount: 0,
        };
      } else {
        return andReq.unsatChildErrors.childErrors.find((error) => {
          return error.childIndex === index;
        });
      }
    }

    return undefined;
  }
};
