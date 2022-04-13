import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { CSSProperties } from "@material-ui/styles";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Concentration, Major } from "@graduate/common";
import {
  safelyGetActivePlanMajorObjectFromState,
  getUserMajorFromState,
  getUserConcentrationFromState,
  safelyGetActivePlanConcentrationFromState,
} from "../state";
import { setStudentConcentrationAction } from "../state/actions/studentActions";
import { setActivePlanConcentrationAction } from "../state/actions/userPlansActions";
import { AppState } from "../state/reducers/state";

interface SaveInParentConcentrationDropdownProps {
  readonly major: Major | undefined;
  readonly concentration: string | null;
  readonly setConcentration: (concentration: string | null) => void;
  readonly setError?: (error: boolean) => void; // To tell the parent that there is an error with the input (no major selected when there should be)
  readonly style?: CSSProperties;
  readonly useLabel?: boolean;
  readonly showError?: boolean;
}

interface SaveOnChangeConcentrationDropdownProps {
  readonly isStudentLevel: boolean; // If this is true, saves the concentration on user level. Otherwise, it saves the concentration to the active plan
  readonly style?: CSSProperties;
  readonly useLabel?: boolean;
}

// Concentration dropdown which sets the concentration in the parent using the given setter whenever it is changed.
const SaveInParentConcentrationDropdown: React.FC<
  SaveInParentConcentrationDropdownProps
> = ({
  major,
  concentration,
  setConcentration,
  setError,
  style,
  useLabel,
  showError,
}) => {
  const concentrationNames: Array<string> = major
    ? major.concentrations.concentrationOptions.map(
        (concentration: Concentration) => concentration.name
      )
    : [];

  const shouldDisplayDropdown: boolean =
    (major && major.concentrations.concentrationOptions.length > 0) || false;

  // An error occurs if there is no concentration selected when at least 1 is required.
  const hasError: boolean =
    !concentration && !!major && major.concentrations.minOptions > 0;

  const onChange = (e: React.SyntheticEvent<any>, value: any) => {
    setConcentration(value);
    if (setError) {
      setError(hasError);
    }
  };

  useEffect(() => {
    if (setError) {
      // Inform the parent about any changes to the error state.
      setError(hasError);
    }
  }, [concentration]);

  // clear the error case if major cleared
  useEffect(() => {
    if (setError && !major) {
      setError(false);
    }
  }, [major]);

  return (
    <>
      {/* This component will only show if concentrations exist for this major */}
      {shouldDisplayDropdown && (
        <Autocomplete
          disableListWrap
          fullWidth
          style={style}
          options={concentrationNames}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={useLabel ? "Concentration" : ""}
              fullWidth
              error={showError && hasError}
              helperText={
                showError && hasError && "A concentration is required."
              }
            />
          )}
          value={concentration}
          onChange={onChange}
        />
      )}
    </>
  );
};

// Concentration dropdown which sets the concentration in Redux whenever it is changed.
const SaveOnChangeConcentrationDropdown: React.FC<
  SaveOnChangeConcentrationDropdownProps
> = ({ isStudentLevel, style, useLabel }) => {
  const dispatch = useDispatch();
  const concentration = useSelector((state: AppState) =>
    isStudentLevel
      ? getUserConcentrationFromState(state)
      : safelyGetActivePlanConcentrationFromState(state)
  );

  const major: Major | undefined = useSelector((state: AppState) =>
    isStudentLevel
      ? getUserMajorFromState(state)
      : safelyGetActivePlanMajorObjectFromState(state)
  );

  const dispatchConcentration = (newConcentration: string | null) => {
    if (isStudentLevel) {
      dispatch(setStudentConcentrationAction(newConcentration));
    } else {
      dispatch(setActivePlanConcentrationAction(newConcentration));
    }
  };

  return (
    <SaveInParentConcentrationDropdown
      major={major}
      concentration={concentration}
      setConcentration={dispatchConcentration}
      style={style}
      useLabel={useLabel}
      showError={true}
    />
  );
};

export { SaveInParentConcentrationDropdown, SaveOnChangeConcentrationDropdown };
