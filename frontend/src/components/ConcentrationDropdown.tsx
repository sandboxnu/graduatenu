import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
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
  readonly isUserLevel: boolean; // If not at the user level, it is at the plan level.
  readonly concentration: string | null;
  readonly setConcentration: (concentration: string | null) => void;
}

interface SaveOnChangeConcentrationDropdownProps {
  readonly isUserLevel: boolean;
}

// Concentration dropdown which sets the concentration in the parent using the given setter whenever it is changed.
const SaveInParentConcentrationDropdown: React.FC<SaveInParentConcentrationDropdownProps> = ({
  isUserLevel,
  concentration,
  setConcentration,
}) => {
  const major: Major | undefined = useSelector((state: AppState) =>
    isUserLevel
      ? getUserMajorFromState(state)
      : safelyGetActivePlanMajorObjectFromState(state)
  );

  const concentrationNames: Array<string> = major
    ? major.concentrations.concentrationOptions.map(
        (concentration: Concentration) => concentration.name
      )
    : [];

  return (
    <>
      {major && (
        <Autocomplete
          disableListWrap
          options={concentrationNames}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              label="Concentration"
              fullWidth
            />
          )}
          value={concentration}
          onChange={(e, value) => {
            setConcentration(value);
          }}
        />
      )}
    </>
  );
};

// Concentration dropdown which sets the concentration in Redux whenever it is changed.
const SaveOnChangeConcentrationDropdown: React.FC<SaveOnChangeConcentrationDropdownProps> = ({
  isUserLevel,
}) => {
  const dispatch = useDispatch();
  const concentration = useSelector((state: AppState) =>
    isUserLevel
      ? getUserConcentrationFromState(state)
      : safelyGetActivePlanConcentrationFromState(state)
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
      isUserLevel={isUserLevel}
      concentration={concentration}
      setConcentration={dispatchConcentration}
    />
  );
};

export { SaveInParentConcentrationDropdown, SaveOnChangeConcentrationDropdown };
