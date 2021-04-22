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
  readonly selectedFolderId: number | null;
  readonly setSelectedFolderId: (selectedFolderId: number | null) => void;
  readonly newFolderName: string;
  readonly setNewFolderName: (newFolderName: string) => void;
  readonly setError: (error: string) => void;
  // This param being optional is a temporary fix before form error handling is overhauled to
  // ensure that this component can still be used on the TemplateInfoPage which doesn't track
  // errors for its fields. If showErrors is not supplied, then the "Required field" message is
  // not shown.
  readonly showErrors?: boolean;
}

export const FolderSelectionContext = createContext<
  Partial<IFolderSelectionContext>
>({});

interface DisplayedFolderInputFieldProps {
  readonly creatingNewFolder: boolean;
  readonly error: string;
}

const DisplayedFolderInputField: React.FC<DisplayedFolderInputFieldProps> = ({
  creatingNewFolder,
  error,
}) => {
  const {
    folders,
    setSelectedFolderId,
    setNewFolderName,
    showErrors,
  } = useContext(FolderSelectionContext) as IFolderSelectionContext;

  useEffect(() => {
    setSelectedFolderId(null);
    setNewFolderName("");
  }, [creatingNewFolder, setNewFolderName, setSelectedFolderId]);

  // TODO: FIx new folder input being a greater height than existing folder input
  if (creatingNewFolder) {
    return (
      <FormControl variant="outlined" error={showErrors && !!error} fullWidth>
        <TextField
          id="outlined-basic"
          label={"New folder name"}
          variant="outlined"
          onChange={event => setNewFolderName(event.target.value)}
          placeholder=""
          error={showErrors && !!error}
          fullWidth
        />
        <FormHelperText>{showErrors && error}</FormHelperText>
      </FormControl>
    );
  }

  return (
    <FormControl variant="outlined" fullWidth error={showErrors && !!error}>
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
            error={showErrors && !!error}
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
      <FormHelperText>{showErrors && error}</FormHelperText>
    </FormControl>
  );
};

export const FolderSelection: React.FC = () => {
  const EXISTING_FOLDER_TAB_INDEX = 0;
  const NEW_FOLDER_TAB_INDEX = 1;

  const [tabValue, setTabValue] = useState(EXISTING_FOLDER_TAB_INDEX);
  const {
    folders,
    selectedFolderId,
    newFolderName,
    setNewFolderName,
    setError,
    showErrors,
  } = useContext(FolderSelectionContext) as IFolderSelectionContext;

  const creatingNewFolder = useMemo(() => tabValue === NEW_FOLDER_TAB_INDEX, [
    tabValue,
  ]);

  const error = useMemo(() => {
    if (showErrors !== undefined && !selectedFolderId && !newFolderName) {
      return "Required field";
    } else if (folders.some(folder => folder.name === newFolderName)) {
      return "Folder name has already been taken";
    }

    return "";
  }, [folders, newFolderName, selectedFolderId, showErrors]);

  const handleTabChange = useCallback(
    (event: React.ChangeEvent<{}>, newValue: number) => {
      setTabValue(newValue);
    },
    []
  );

  // This allows this form to set errors within the parent form.
  useEffect(() => {
    setError(error);
  }, [error, setError]);

  if (folders.length < 1) {
    return (
      <FormControl variant="outlined" error={showErrors && !!error} fullWidth>
        <TextField
          id="outlined-basic"
          label={"New folder name"}
          variant="outlined"
          onChange={event => setNewFolderName(event.target.value)}
          placeholder=""
          error={showErrors && !!error}
          fullWidth
        />
        <FormHelperText>{showErrors && error}</FormHelperText>
      </FormControl>
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
        error={error}
      />
    </FolderSelectionContainer>
  );
};
