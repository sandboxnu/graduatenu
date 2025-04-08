import {
  MajorValidationError,
  MajorValidationErrorType,
  MajorValidationResult,
  ResultType,
} from "@graduate/common";

export const getSectionError = (
  andIndex: number, // The AND index (major, minor, etc.)
  sectionIndex: number, // The specific section index within the AND
  validationStatus: MajorValidationResult | undefined
): MajorValidationError | undefined => {
  if (!validationStatus || validationStatus.type !== ResultType.Err) {
    return undefined;
  }

  const majorError = validationStatus.err.majorRequirementsError;
  if (!majorError) {
    throw new Error("Top-level requirement should have an error.");
  }
  if (majorError.type !== MajorValidationErrorType.And.Type) {
    throw new Error("Top-level requirement error should be AND.");
  }

  // AND handling
  const andReq = majorError.error;

  // Checking if the and requirement is unsatisfied
  if (andReq.type === MajorValidationErrorType.And.UnsatChild) {
    // The way it is set up: err -> majorRequirmentErorrs -> error -> childError -> error -> unsatchilderrors -> childerrors
    // Checks if childerrors is an array (since childerrors would have all the classes) and the andIndex is within the range of those classes

    const specificAndError = andReq.childErrors.find(
      (childErrors: { childIndex: number }) => {
        return childErrors.childIndex === andIndex;
      }
    );

    if (!specificAndError) {
      return;
    }

    // Ensure `specificAndError` has `childErrors` before accessing
    // This isn't right what is happening here...
    // We want to go into the childerrors
    if (specificAndError.type === MajorValidationErrorType.And.Type) {
      if (
        specificAndError.error.type ===
        MajorValidationErrorType.And.UnsatChildAndNoSolution
      ) {
        return specificAndError.error.unsatChildErrors.childErrors.find(
          (childErrors: { childIndex: number }) =>
            childErrors.childIndex === sectionIndex
        );
      } else if (
        specificAndError.error.type === MajorValidationErrorType.And.UnsatChild
      ) {
        return specificAndError.error.childErrors.find(
          (childErrors: { childIndex: number }) =>
            childErrors.childIndex === sectionIndex
        );
      }
    }
  }

  // **Handle "AND_NO_SOLUTION" separately**
  if (andReq.type === MajorValidationErrorType.And.NoSolution) {
    if (andReq.discoveredAtChild === sectionIndex) {
      return {
        type: "SECTION",
        sectionTitle: "No Solution Section",
        childErrors: [],
        minRequiredChildCount: 0,
        maxPossibleChildCount: 0,
      };
    }
    return undefined;
  }

  // **Handle "AND_UNSAT_CHILD_AND_NO_SOLUTION"**
  if (andReq.type === MajorValidationErrorType.And.UnsatChildAndNoSolution) {
    if (andReq.noSolution.discoveredAtChild === sectionIndex) {
      return {
        type: "SECTION",
        sectionTitle: "No Solution Section",
        childErrors: [],
        minRequiredChildCount: 0,
        maxPossibleChildCount: 0,
      };
    }

    // Ensure `unsatChildErrors.childErrors` exists before accessing it
    if (
      andIndex < andReq.unsatChildErrors.childErrors.length &&
      Array.isArray(andReq.unsatChildErrors.childErrors)
    ) {
      return andReq.unsatChildErrors.childErrors.find(
        (error) => error.childIndex === sectionIndex
      );
    }
  }

  return undefined;
};
