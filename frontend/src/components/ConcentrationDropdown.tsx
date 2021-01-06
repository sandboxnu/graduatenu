import { FormControl, FormHelperText, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { CSSProperties } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Concentration, Major } from "../../../common/types";
import {
  safelyGetActivePlanMajorObjectFromState,
  getUserMajorFromState,
  getUserConcentrationFromState,
  safelyGetActivePlanConcentrationFromState,
} from "../state";
import { setUserConcentrationAction } from "../state/actions/userActions";
import { setActivePlanConcentrationAction } from "../state/actions/userPlansActions";
import { AppState } from "../state/reducers/state";

interface SaveInParentConcentrationDropdownProps {
  readonly major: Major | undefined;
  readonly concentration: string | null;
  readonly setConcentration: (concentration: string | null) => void;
  readonly setError?: (error: boolean) => void; // To tell the parent that there is an error with the input (no major selected when there should be)
  readonly style?: CSSProperties;
  readonly useLabel?: boolean;
  readonly hideError?: boolean;
}

interface SaveOnChangeConcentrationDropdownProps {
  readonly isUserLevel: boolean;
  readonly style?: CSSProperties;
  readonly useLabel?: boolean;
}

// Concentration dropdown which sets the concentration in the parent using the given setter whenever it is changed.
const SaveInParentConcentrationDropdown: React.FC<SaveInParentConcentrationDropdownProps> = ({
  major,
  concentration,
  setConcentration,
  setError,
  style,
  useLabel,
  hideError,
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

  const onChange = (e: React.SyntheticEvent<{}>, value: any) => {
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

  return (
    <>
      {shouldDisplayDropdown && (
        <FormControl variant="outlined" error={hasError} style={style}>
          <Autocomplete
            disableListWrap
            options={concentrationNames}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                label={useLabel ? "Concentration" : ""}
                fullWidth
                error={!hideError && hasError}
              />
            )}
            value={concentration}
            onChange={onChange}
          />
          <FormHelperText>
            {!hideError &&
              hasError &&
              "A concentration is required for your selected major"}
          </FormHelperText>
        </FormControl>
      )}
    </>
  );
};

// Concentration dropdown which sets the concentration in Redux whenever it is changed.
const SaveOnChangeConcentrationDropdown: React.FC<SaveOnChangeConcentrationDropdownProps> = ({
  isUserLevel,
  style,
  useLabel,
}) => {
  const dispatch = useDispatch();
  const concentration = useSelector((state: AppState) =>
    isUserLevel
      ? getUserConcentrationFromState(state)
      : safelyGetActivePlanConcentrationFromState(state)
  );

  const major: Major | undefined = useSelector((state: AppState) =>
    isUserLevel
      ? getUserMajorFromState(state)
      : safelyGetActivePlanMajorObjectFromState(state)
  );

  const dispatchConcentration = (newConcentration: string | null) => {
    if (isUserLevel) {
      dispatch(setUserConcentrationAction(newConcentration));
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
    />
  );
};

export { SaveInParentConcentrationDropdown, SaveOnChangeConcentrationDropdown };
