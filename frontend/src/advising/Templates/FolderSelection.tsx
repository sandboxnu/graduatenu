import {
  FormControl,
  FormHelperText,
  Tab,
  Tabs,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "styled-components";
import { IFolderData } from "../../models/types";

const INPUT_WIDTH = 326;

const FolderSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 326px;
`;

const FolderSelectionTabContainer = styled.div`
  margin-bottom: 18px;
`;

interface DisplayedFolderInputFieldProps {
  readonly creatingNewFolder: boolean;
  readonly hasDuplicateFolderName: boolean;
}

interface FolderSelectionProps {
  readonly setHasDuplicateFolderName: (hasDuplicateFolderName: boolean) => void;
}

export interface IFolderContext {
  readonly folders: IFolderData[];
  readonly setSelectedFolderId: (selectedFolderId: number | null) => void;
  readonly newFolderName: string;
  readonly setNewFolderName: (newFolderName: string) => void;
}

export const FolderContext = createContext<Partial<IFolderContext>>({});

const DisplayedFolderInputField: React.FC<DisplayedFolderInputFieldProps> = ({
  creatingNewFolder,
  hasDuplicateFolderName,
}) => {
  const { folders, setSelectedFolderId, setNewFolderName } = useContext(
    FolderContext
  ) as IFolderContext;

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
        <TextField
          id="outlined-basic"
          label={"New folder name"}
          variant="outlined"
          onChange={event => setNewFolderName(event.target.value)}
          placeholder=""
          style={{ width: `${INPUT_WIDTH}px` }}
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

export const FolderSelection: React.FC<FolderSelectionProps> = ({
  setHasDuplicateFolderName,
}) => {
  const EXISTING_FOLDER_TAB_INDEX = 0;
  const NEW_FOLDER_TAB_INDEX = 1;

  const [tabValue, setTabValue] = useState(EXISTING_FOLDER_TAB_INDEX);
  const { folders, newFolderName, setNewFolderName } = useContext(
    FolderContext
  ) as IFolderContext;

  const creatingNewFolder = useMemo(() => tabValue === NEW_FOLDER_TAB_INDEX, [
    tabValue,
  ]);

  const hasDuplicateFolderName = useMemo(
    () => folders.some(folder => folder.name === newFolderName),
    [folders, newFolderName]
  );

  const handleTabChange = useCallback(
    (event: React.ChangeEvent<{}>, newValue: number) => {
      setTabValue(newValue);
    },
    []
  );

  // This allows this form to set errors within the parent form.
  useEffect(() => {
    setHasDuplicateFolderName(hasDuplicateFolderName);
  }, [hasDuplicateFolderName, setHasDuplicateFolderName]);

  if (folders.length < 1) {
    return (
      <TextField
        id="outlined-basic"
        label={"New folder name"}
        variant="outlined"
        onChange={event => setNewFolderName(event.target.value)}
        placeholder=""
        style={{ width: `${INPUT_WIDTH}px` }}
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
      <DisplayedFolderInputField
        creatingNewFolder={creatingNewFolder}
        hasDuplicateFolderName={hasDuplicateFolderName}
      />
    </FolderSelectionContainer>
  );
};
