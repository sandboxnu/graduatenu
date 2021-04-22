import { TextField, FormControl } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect } from "react";
import { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import {
  WhiteColorButton,
  RedColorButton,
} from "../../components/common/ColoredButtons";
import { SaveInParentConcentrationDropdown } from "../../components/ConcentrationDropdown";
import { findMajorFromName } from "../../utils/plan-helpers";
import { IFolderData } from "../../models/types";
import {
  createTemplate,
  getTemplates,
  TemplatesAPI,
} from "../../services/TemplateService";
import {
  getAdvisorUserIdFromState,
  getMajorsFromState,
  getPlansFromState,
} from "../../state";
import { addNewPlanAction } from "../../state/actions/userPlansActions";
import { AppState } from "../../state/reducers/state";
import {
  generateBlankCoopPlan,
  generateYearlessSchedule,
  planToString,
} from "../../utils";
import { FolderSelectionContext, FolderSelection } from "./FolderSelection";

const Header = styled.div`
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 50px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  overflow: hidden;
`;

const NewTemplatesPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  width: 326px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px;
`;

interface DropdownProps {
  readonly label: string;
  readonly options: Array<string>;
  readonly value: string | null;
  readonly setValue: (value: string | null) => void;
}

export const NewTemplatesPage: React.FC<RouteComponentProps<{}>> = ({
  history,
}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [major, setMajor] = useState<string | null>(null);
  const [concentration, setConcentration] = useState<string | null>(null);
  const [hasConcentrationError, setHasConcentrationError] = useState(false);
  const [hasDuplicateFolderName, setHasDuplicateFolderName] = useState(false);
  const [showConcentrationError, setShowConcentrationError] = useState(false);
  const [catalogYear, setCatalogYear] = useState<string | null>(null);
  const [coopCycle, setCoopCycle] = useState<string | null>(null);
  const [folders, setFolders] = useState<IFolderData[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [newFolderName, setNewFolderName] = useState<string>("");

  const fetchTemplates = () => {
    getTemplates(userId, "", 0)
      .then((response: TemplatesAPI) => {
        setFolders(response.templates);
      })
      .catch((err: any) => console.log(err));
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const { majors, userId, allCoopCycles } = useSelector(
    (state: AppState) => ({
      userId: getAdvisorUserIdFromState(state),
      majors: getMajorsFromState(state),
      allCoopCycles: getPlansFromState(state),
    }),
    shallowEqual
  );
  const catalogYears = [
    ...Array.from(new Set(majors.map(maj => maj.yearVersion.toString()))),
  ];
  const buttonSize = 90;
  const majorObj = findMajorFromName(major, majors, Number(catalogYear));

  // TODO: Redo error handling to show errors for individual fields when
  // pressing "Next" rather than keeping the button disabled
  const disabled =
    !(
      name &&
      major &&
      catalogYear &&
      (selectedFolderId !== null || newFolderName)
    ) ||
    hasConcentrationError ||
    hasDuplicateFolderName;

  const onSubmit = async () => {
    let schedule, courseCounter;

    if (hasConcentrationError) {
      setShowConcentrationError(true);
      return;
    } else if (!!coopCycle) {
      [schedule, courseCounter] = generateBlankCoopPlan(
        major!,
        coopCycle!,
        allCoopCycles
      );
    } else {
      schedule = generateYearlessSchedule([], 4);
      courseCounter = 0;
    }

    const response = await createTemplate(userId!, {
      name: name,
      schedule: schedule,
      major: major,
      concentration: concentration,
      coop_cycle: coopCycle,
      course_counter: courseCounter,
      catalog_year: catalogYear ? Number(catalogYear) : null,
      folder_id: selectedFolderId,
      folder_name:
        folders.find(folder => selectedFolderId === folder.id)?.name ||
        newFolderName ||
        null,
    });
    dispatch(addNewPlanAction(response.templatePlan));
    return response.templatePlan.id;
  };

  return (
    <FolderSelectionContext.Provider
      value={{
        folders,
        selectedFolderId,
        setSelectedFolderId,
        newFolderName,
        setNewFolderName,
        setError: () => {},
      }}
    >
      <NewTemplatesPageContainer>
        <Header style={{ fontSize: "24px" }}>Let's create a template!</Header>
        <FieldContainer>
          <TextField
            id="outlined-basic"
            label={"Template name"}
            variant="outlined"
            onChange={event => setName(event.target.value)}
            placeholder=""
            error={false}
            fullWidth
          />
          <FolderSelection />
          <Dropdown
            label="Catalog year"
            options={catalogYears}
            value={catalogYear}
            setValue={value => {
              setCatalogYear(value);
              setMajor(null);
              setCoopCycle(null);
            }}
          />
          {catalogYear && (
            <Dropdown
              label="Major"
              options={majors.map(maj => maj.name)}
              value={major}
              setValue={value => {
                setMajor(value);
                setConcentration(null);
                setShowConcentrationError(false);
                setCoopCycle(null);
              }}
            />
          )}
          {major && (
            <SaveInParentConcentrationDropdown
              major={majorObj}
              concentration={concentration}
              setConcentration={setConcentration}
              setError={setHasConcentrationError}
              useLabel={true}
              showError={showConcentrationError}
            />
          )}
          {major && (
            <Dropdown
              label="Co-op cycle"
              options={allCoopCycles[major!].map(p => planToString(p))}
              value={coopCycle}
              setValue={setCoopCycle}
            />
          )}
        </FieldContainer>
        <ButtonContainer>
          <Link
            to={{ pathname: "/advisor/templates/" }}
            style={{ textDecoration: "none" }}
          >
            <WhiteColorButton
              style={{ width: buttonSize, marginRight: "20px" }}
            >
              Previous
            </WhiteColorButton>
          </Link>
          <RedColorButton
            onClick={async () => {
              const planId = await onSubmit();
              history.push(`/advisor/templates/templateBuilder/${planId}`);
            }}
            style={{ width: buttonSize }}
            disabled={disabled}
          >
            Next
          </RedColorButton>
        </ButtonContainer>
      </NewTemplatesPageContainer>
    </FolderSelectionContext.Provider>
  );
};

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  setValue,
}) => {
  return (
    <FormControl variant="outlined" fullWidth>
      <Autocomplete
        disableListWrap
        options={options}
        renderInput={params => (
          <TextField {...params} variant="outlined" label={label} fullWidth />
        )}
        value={value}
        onChange={(event, newValue: any) => setValue(newValue || null)}
      />
    </FormControl>
  );
};
