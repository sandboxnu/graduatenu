import {
  TextField,
  FormControl,
  Tabs,
  Tab,
  FormHelperText,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { createContext, useContext, useEffect, useMemo } from "react";
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

const INPUT_WIDTH = 326;

const Container = styled.div`
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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px;
`;

const InputContainer = styled.div`
  width: ${INPUT_WIDTH}px;
`;

const FolderSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: ${INPUT_WIDTH}px;
`;

const FolderSelectionTabContainer = styled.div`
  margin-bottom: 18px;
`;

interface DropdownProps {
  readonly label: string;
  readonly options: Array<string>;
  readonly value: string | null;
  readonly setValue: (value: string | null) => void;
}

interface NameFieldProps {
  readonly name: string;
  readonly setName: (name: string) => void;
  readonly label: string;
  readonly error: boolean;
}

interface FolderContext {
  readonly folders: IFolderData[];
  readonly setSelectedFolderId: (selectedFolderId: number | null) => void;
  readonly newFolderName: string;
  readonly setNewFolderName: (newFolderName: string) => void;
  readonly hasDuplicateFolderName: boolean;
}

const folderContext = createContext<Partial<FolderContext>>({});

const NameField: React.FC<NameFieldProps> = ({
  name,
  setName,
  label,
  error,
}) => {
  return (
    <TextField
      id="outlined-basic"
      label={label}
      variant="outlined"
      value={name}
      onChange={event => setName(event.target.value)}
      placeholder=""
      style={{ width: "100%" }}
      error={error}
    />
  );
};

const DisplayedFolderInputField: React.FC<{ creatingNewFolder: boolean }> = ({
  creatingNewFolder,
}) => {
  const {
    folders,
    setSelectedFolderId,
    newFolderName,
    setNewFolderName,
    hasDuplicateFolderName,
  } = useContext(folderContext) as FolderContext;

  useEffect(() => {
    setSelectedFolderId(null);
    setNewFolderName("");
  }, [creatingNewFolder]);

  // TODO: FIx new folder input being a greater height than existing folder input
  if (creatingNewFolder) {
    return (
      <FormControl
        variant="outlined"
        error={hasDuplicateFolderName}
        style={{ width: INPUT_WIDTH }}
      >
        <NameField
          name={newFolderName}
          setName={setNewFolderName}
          label={"New folder name"}
          error={hasDuplicateFolderName}
        />
        <FormHelperText>
          {hasDuplicateFolderName && "Folder name has already been taken"}
        </FormHelperText>
      </FormControl>
    );
  }

  return (
    <FormControl variant="outlined">
      <Autocomplete
        style={{ width: INPUT_WIDTH }}
        disableListWrap
        getOptionLabel={option => option.name}
        options={folders}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label={"Existing folder"}
            fullWidth
          />
        )}
        onChange={(event, newValue: any) =>
          setSelectedFolderId(newValue.id || null)
        }
      />
    </FormControl>
  );
};

const FolderSelection: React.FC<{}> = () => {
  const EXISTING_FOLDER_TAB_INDEX = 0;
  const NEW_FOLDER_TAB_INDEX = 1;

  const [tabValue, setTabValue] = useState(EXISTING_FOLDER_TAB_INDEX);
  const {
    folders,
    newFolderName,
    setNewFolderName,
    hasDuplicateFolderName,
  } = useContext(folderContext) as FolderContext;
  const creatingNewFolder = tabValue === NEW_FOLDER_TAB_INDEX;

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  if (folders.length < 1) {
    return (
      <NameField
        name={newFolderName}
        setName={setNewFolderName}
        label={"New folder name"}
        error={hasDuplicateFolderName}
      />
    );
  }

  return (
    <FolderSelectionContainer>
      <FolderSelectionTabContainer>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: {
              bottom: "4px",
            },
          }}
        >
          <Tab label="Existing Folder" />
          <Tab label="New Folder" />
        </Tabs>
      </FolderSelectionTabContainer>
      <DisplayedFolderInputField creatingNewFolder={creatingNewFolder} />
    </FolderSelectionContainer>
  );
};

export const NewTemplatesPage: React.FC<RouteComponentProps<{}>> = ({
  history,
}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [major, setMajor] = useState<string | null>(null);
  const [concentration, setConcentration] = useState<string | null>(null);
  const [hasConcentrationError, setHasConcentrationError] = useState(false);
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
  const hasDuplicateFolderName = folders.some(
    folder => folder.name === newFolderName
  );

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
    <folderContext.Provider
      value={{
        folders,
        setSelectedFolderId,
        newFolderName,
        setNewFolderName,
        hasDuplicateFolderName,
      }}
    >
      <NewTemplatesPageContainer>
        <Container style={{ fontSize: "24px" }}>
          Let's create a template!
        </Container>
        <InputContainer>
          <NameField
            name={name}
            setName={setName}
            label={"Template name"}
            error={false}
          />
        </InputContainer>
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
            style={{ width: INPUT_WIDTH }}
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
    </folderContext.Provider>
  );
};

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  setValue,
}) => {
  return (
    <FormControl variant="outlined">
      <Autocomplete
        style={{ width: INPUT_WIDTH }}
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
