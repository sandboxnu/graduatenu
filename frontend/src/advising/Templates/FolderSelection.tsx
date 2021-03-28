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

const FolderSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  box-sizing: border-box;
  width: 100%;
`;

const FolderSelectionTabContainer = styled.div`
  margin-bottom: 18px;
`;

export interface IFolderSelectionContext {
  readonly folders: IFolderData[];
  readonly setSelectedFolderId: (selectedFolderId: number | null) => void;
  readonly newFolderName: string;
  readonly setNewFolderName: (newFolderName: string) => void;
}

export const FolderSelectionContext = createContext<
  Partial<IFolderSelectionContext>
>({});

interface DisplayedFolderInputFieldProps {
  readonly creatingNewFolder: boolean;
  readonly hasDuplicateFolderName: boolean;
}

interface FolderSelectionProps {
  readonly setHasDuplicateFolderName: (hasDuplicateFolderName: boolean) => void;
}

const DisplayedFolderInputField: React.FC<DisplayedFolderInputFieldProps> = ({
  creatingNewFolder,
  hasDuplicateFolderName,
}) => {
  const { folders, setSelectedFolderId, setNewFolderName } = useContext(
    FolderSelectionContext
  ) as IFolderSelectionContext;

  useEffect(() => {
    setSelectedFolderId(null);
    setNewFolderName("");
  }, [creatingNewFolder, setNewFolderName, setSelectedFolderId]);

  // TODO: FIx new folder input being a greater height than existing folder input
  if (creatingNewFolder) {
    return (
      <FormControl variant="outlined" error={hasDuplicateFolderName} fullWidth>
        <TextField
          id="outlined-basic"
          label={"New folder name"}
          variant="outlined"
          onChange={event => setNewFolderName(event.target.value)}
          placeholder=""
          error={hasDuplicateFolderName}
          fullWidth
        />
        <FormHelperText>
          {hasDuplicateFolderName && "Folder name has already been taken"}
        </FormHelperText>
      </FormControl>
    );
  }

  return (
    <FormControl variant="outlined" fullWidth>
      <Autocomplete
        disableListWrap
        fullWidth
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
        onChange={(event, newValue: IFolderData | null) => {
          if (newValue) {
            setSelectedFolderId(newValue.id);
            return;
          }

          setSelectedFolderId(null);
        }}
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
    FolderSelectionContext
  ) as IFolderSelectionContext;

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
        error={hasDuplicateFolderName}
        fullWidth
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
