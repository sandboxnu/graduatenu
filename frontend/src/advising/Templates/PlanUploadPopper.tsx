import { IconButton, Modal, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useState, useCallback, useMemo, useContext } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Major, Schedule } from "../../../../common/types";
import { RedColorButton } from "../../components/common/ColoredButtons";
import { ExcelWorkbookUpload } from "../../components/ExcelUpload";
import { ICreateTemplatePlan } from "../../models/types";
import { createTemplate } from "../../services/TemplateService";
import { convertToDNDSchedule } from "../../utils";
import styled from "styled-components";
import { getAdvisorUserIdFromState, getMajorsFromState } from "../../state";
import { useSelector } from "react-redux";
import { AppState } from "../../state/reducers/state";
import { findMajorFromName } from "../../utils/plan-helpers";
import { ITemplateContext, TemplateContext } from "./TemplateListPage";

const InnerSection = styled.section`
  position: fixed;
  background: white;
  width: 30%;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  padding-bottom: 24px;
  min-width: 300px;
`;

interface PlanUploadPopperProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

interface PlanUploadPopperErrorState {
  noFolderSelectedError: string;
}

export const PlanUploadPopper: React.FC<PlanUploadPopperProps> = ({
  visible,
  setVisible,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [catalogYear, setCatalogYear] = useState<number | null>(null);
  const [major, setMajor] = useState<Major | null>(null);
  const [namedSchedules, setNamedSchedules] = useState<[string, Schedule][]>(
    []
  );
  const [errorState, setErrorState] = useState<PlanUploadPopperErrorState>({
    noFolderSelectedError: "",
  });

  const { userId, majors } = useSelector((state: AppState) => ({
    userId: getAdvisorUserIdFromState(state),
    majors: getMajorsFromState(state),
  }));

  const { templates, fetchTemplates } = useContext(
    TemplateContext
  ) as ITemplateContext;

  // Errors:
  // - no folder selected
  // - invalid folder selected
  // - failed to convert schedules

  const renderCatalogYearDropdown = useMemo(() => {
    const catalogYears = [
      ...Array.from(
        new Set(majors.map((maj: Major) => maj.yearVersion.toString()))
      ),
    ];

    return (
      <Autocomplete
        disableListWrap
        options={catalogYears}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Catalog Year"
            fullWidth
          />
        )}
        onChange={(e, value) => {
          setCatalogYear(value === "" ? null : Number(value));
          setMajor(null);
        }}
      />
    );
  }, [majors]);

  const renderMajorDropDown = useMemo(() => {
    const options = majors
      .filter(maj => maj.yearVersion === catalogYear)
      .map(maj => maj.name);

    return (
      <Autocomplete
        disableListWrap
        options={options}
        renderInput={params => (
          <TextField {...params} variant="outlined" label="Major" fullWidth />
        )}
        onChange={(e, value) => {
          setMajor(findMajorFromName(value, majors, catalogYear) || null);
        }}
      />
    );
  }, [catalogYear, majors]);

  const namedScheduleToCreateTemplatePlan = useCallback(
    ([name, schedule]: [string, Schedule]): ICreateTemplatePlan => {
      const [dndSchedule, courseCounter] = convertToDNDSchedule(schedule, 0);

      return {
        name,
        schedule: dndSchedule,
        catalog_year: catalogYear,
        major: major ? major.name : major,
        coop_cycle: null,
        concentration: null,
        folder_id: selectedFolderId,
        folder_name:
          templates.find(value => value.id === selectedFolderId)?.name || null,
        course_counter: courseCounter,
      };
    },
    [catalogYear, major, selectedFolderId, templates]
  );

  const createTemplatesFromNamedSchedules = useCallback(async () => {
    if (!namedSchedules) {
      return;
      // TODO error handling
    }

    await Promise.all(
      namedSchedules.map(namedSchedule =>
        createTemplate(userId, namedScheduleToCreateTemplatePlan(namedSchedule))
      )
    );

    fetchTemplates([], 0);
  }, [
    fetchTemplates,
    namedScheduleToCreateTemplatePlan,
    namedSchedules,
    userId,
  ]);

  return (
    <Modal
      style={{ outline: "none" }}
      open={visible}
      onClose={() => {}}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <InnerSection>
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
        <h1 id="simple-modal-title">Create a New Plan</h1>
        <Autocomplete
          disableListWrap
          options={templates}
          getOptionLabel={folder => folder.name}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              label="Select a destination folder"
              fullWidth
              // error={""}
              // helperText={error && REQUIRED_FIELD_MESSAGE}
            />
          )}
          onChange={(e, value) => setSelectedFolderId(value ? value.id : value)}
        ></Autocomplete>
        {renderCatalogYearDropdown}
        {renderMajorDropDown}
        <ExcelWorkbookUpload setNamedSchedules={setNamedSchedules} />
        <RedColorButton onClick={createTemplatesFromNamedSchedules}>
          Import
        </RedColorButton>
      </InnerSection>
    </Modal>
  );
};
