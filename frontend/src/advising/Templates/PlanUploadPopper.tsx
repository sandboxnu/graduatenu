import {
  FormControl,
  FormHelperText,
  IconButton,
  Modal,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Major, Schedule } from "../../../../common/types";
import { RedColorButton } from "../../components/common/ColoredButtons";
import { ExcelWorkbookUpload } from "../../components/ExcelUpload";
import { ICreateTemplatePlan } from "../../models/types";
import { createFolder, createTemplate } from "../../services/TemplateService";
import { convertToDNDSchedule } from "../../utils";
import styled from "styled-components";
import { getAdvisorUserIdFromState, getMajorsFromState } from "../../state";
import { useSelector } from "react-redux";
import { AppState } from "../../state/reducers/state";
import { findMajorFromName } from "../../utils/plan-helpers";
import { FolderSelection, FolderSelectionContext } from "./FolderSelection";
import {
  ITemplateContext,
  TemplateContext,
  useTemplatesApi,
} from "./useTemplatesApi";
import { SaveInParentConcentrationDropdown } from "../../components/ConcentrationDropdown";
import { BASE_FORMATTED_COOP_CYCLES } from "../../plans/coopCycles";

const InnerSection = styled.section`
  position: fixed;
  background: white;
  width: 50%;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  outline: none;
  padding-bottom: 24px;
  min-width: 400px;
`;

const FieldContainer = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

interface PlanUploadPopperProps {
  readonly visible: boolean;
  readonly setVisible: (visible: boolean) => void;
}

interface PlanUploadPopperFields {
  readonly selectedFolderId: number | null;
  readonly newFolderName: string;
  readonly catalogYear: number | null;
  readonly major: Major | null;
  readonly concentration: string | null;
  readonly namedSchedules: [string, Schedule][];
}

const REQUIRED_FIELD_ERROR = "Required field";

const usePlanUploadPopperErrors = (fields: PlanUploadPopperFields) => {
  const [folderSelectionError, setFolderSelectionError] = useState<string>("");
  const [hasConcentrationError, setHasConcentrationError] = useState<boolean>();

  const catalogYearError = useMemo(() => {
    if (!fields.catalogYear) {
      return REQUIRED_FIELD_ERROR;
    }

    return "";
  }, [fields.catalogYear]);

  const majorError = useMemo(() => {
    if (!fields.major) {
      return REQUIRED_FIELD_ERROR;
    } else if (fields.major && !fields.catalogYear) {
      return "Cannot have major without catalog year";
    }

    return "";
  }, [fields.catalogYear, fields.major]);

  const concentrationError = useMemo(() => {
    if (hasConcentrationError) {
      return "A concentration is required for your selected major";
    }

    return "";
  }, [hasConcentrationError]);

  const namedSchedulesError = useMemo(() => {
    if (fields.namedSchedules.length < 1) {
      return "No templates uploaded";
    }

    return "";
  }, [fields.namedSchedules.length]);

  return {
    errors: {
      folderSelectionError,
      catalogYearError,
      majorError,
      concentrationError,
      namedSchedulesError,
    },
    setFolderSelectionError,
    setHasConcentrationError,
  };
};

export const PlanUploadPopper: React.FC<PlanUploadPopperProps> = ({
  visible,
  setVisible,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [catalogYear, setCatalogYear] = useState<number | null>(null);
  const [major, setMajor] = useState<Major | null>(null);
  const [concentration, setConcentration] = useState<string | null>(null);
  const [coopCycle, setCoopCycle] = useState<string | null>(null);
  const [namedSchedules, setNamedSchedules] = useState<[string, Schedule][]>(
    []
  );
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const {
    errors,
    setFolderSelectionError,
    setHasConcentrationError,
  } = usePlanUploadPopperErrors({
    selectedFolderId,
    newFolderName,
    catalogYear,
    major,
    concentration,
    namedSchedules,
  });

  const { userId, majors } = useSelector((state: AppState) => ({
    userId: getAdvisorUserIdFromState(state),
    majors: getMajorsFromState(state),
  }));

  // This must be used instead of fetching from the context in order to avoid
  // any search query being applied to the shown available folders.
  const { templates: folders } = useTemplatesApi("");

  // The parent templates fetcher is used to update the templates shown in the
  // TemplateListPage while maintaining any search query used after adding templates.
  const { fetchTemplates: fetchParentTemplates } = useContext(
    TemplateContext
  ) as ITemplateContext;

  useEffect(() => {
    if (!visible) {
      setShowErrors(false);
    }
  }, [visible]);

  const CatalogYearDropdown = useMemo(() => {
    const catalogYears = [
      ...Array.from(
        new Set(majors.map((maj: Major) => maj.yearVersion.toString()))
      ),
    ];

    const onChange = (e: React.ChangeEvent<{}>, value: string | null) => {
      setCatalogYear(value === "" ? null : Number(value));
      setMajor(null);
    };

    const error = showErrors && errors.catalogYearError;

    return (
      <FormControl variant="outlined" error={!!error} fullWidth>
        <Autocomplete
          disableListWrap
          options={catalogYears}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              label="Catalog Year"
              fullWidth
              error={!!error}
            />
          )}
          onChange={onChange}
        />
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    );
  }, [errors.catalogYearError, majors, showErrors]);

  const MajorDropdown = useMemo(() => {
    if (!catalogYear) {
      return;
    }

    const options = majors
      .filter(maj => maj.yearVersion === catalogYear)
      .map(maj => maj.name);

    const onChange = (e: React.ChangeEvent<{}>, value: string | null) => {
      setMajor(findMajorFromName(value, majors, catalogYear) || null);
    };

    const error = showErrors && errors.majorError;

    return (
      <FormControl variant="outlined" error={!!error} fullWidth>
        <Autocomplete
          disableListWrap
          options={options}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              label="Major"
              error={!!error}
              fullWidth
            />
          )}
          onChange={onChange}
        />
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    );
  }, [catalogYear, errors, majors, showErrors]);

  const CoopCycleDropdown = useMemo(() => {
    if (!major) {
      return;
    }

    const options = ["None", ...BASE_FORMATTED_COOP_CYCLES];

    const onChange = (e: React.ChangeEvent<{}>, value: string | null) => {
      setCoopCycle(value || null);
    };

    return (
      <Autocomplete
        disableListWrap
        options={options}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Co-op Cycle"
            fullWidth
          />
        )}
        onChange={onChange}
      />
    );
  }, [major]);

  const namedScheduleToCreateTemplatePlan = useCallback(
    (
      [name, schedule]: [string, Schedule],
      folderId: number
    ): ICreateTemplatePlan => {
      const [dndSchedule, courseCounter] = convertToDNDSchedule(schedule, 0);

      return {
        name,
        schedule: dndSchedule,
        catalog_year: catalogYear,
        major: major ? major.name : null,
        coop_cycle: coopCycle || null,
        concentration: concentration || null,
        folder_id: folderId,
        folder_name: null,
        course_counter: courseCounter,
      };
    },
    [catalogYear, concentration, coopCycle, major]
  );

  const getFolderIdForNewTemplates = useCallback(async () => {
    // Create the new standalone folder and get its ID.
    if (newFolderName) {
      const { folder } = await createFolder(userId, newFolderName);
      return folder.id;
    }

    // Use the selected folder ID.
    return selectedFolderId;
  }, [newFolderName, selectedFolderId, userId]);

  const createTemplatesFromNamedSchedules = useCallback(async () => {
    const folderId = await getFolderIdForNewTemplates();

    if (!folderId) {
      return;
    }

    await Promise.all(
      namedSchedules.map(namedSchedule =>
        createTemplate(
          userId,
          namedScheduleToCreateTemplatePlan(namedSchedule, folderId)
        )
      )
    );

    fetchParentTemplates([], 0);
    setVisible(false);
  }, [
    fetchParentTemplates,
    getFolderIdForNewTemplates,
    namedScheduleToCreateTemplatePlan,
    namedSchedules,
    setVisible,
    userId,
  ]);

  const onSubmit = useCallback(() => {
    if (Object.values(errors).some(Boolean)) {
      setShowErrors(true);
      return;
    }

    createTemplatesFromNamedSchedules();
  }, [createTemplatesFromNamedSchedules, errors]);

  const CloseButton = useMemo(
    () => (
      <IconButton
        style={{
          padding: "3px",
          position: "absolute",
          top: "12px",
          right: "18px",
        }}
        onClick={() => setVisible(false)}
      >
        <CloseIcon />
      </IconButton>
    ),
    [setVisible]
  );

  return (
    <FolderSelectionContext.Provider
      value={{
        folders,
        selectedFolderId,
        setSelectedFolderId,
        newFolderName,
        setNewFolderName,
        setError: setFolderSelectionError,
        showErrors,
      }}
    >
      <Modal
        style={{ outline: "none" }}
        open={visible}
        onClose={() => {}}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <InnerSection>
          {CloseButton}
          <h1 id="simple-modal-title">Upload Plans</h1>
          <FieldContainer>
            <FolderSelection />
            {CatalogYearDropdown}
            {MajorDropdown}
            <SaveInParentConcentrationDropdown
              major={major ?? undefined}
              concentration={concentration}
              setConcentration={setConcentration}
              setError={setHasConcentrationError}
              showError={showErrors}
              useLabel
            />
            {CoopCycleDropdown}
            <ExcelWorkbookUpload setNamedSchedules={setNamedSchedules} />
          </FieldContainer>
          <RedColorButton onClick={onSubmit}>Import</RedColorButton>
        </InnerSection>
      </Modal>
    </FolderSelectionContext.Provider>
  );
};
