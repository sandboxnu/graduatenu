import * as React from "react";
import {
  excelToSchedule,
  excelToScheduleMultipleSheets,
} from "../utils/excelParser";
import { Schedule } from "../../../common/types";
import { Tooltip } from "@material-ui/core";
import { useState } from "react";

interface Props {
  setSchedule: (schedule: Schedule) => void;
}

interface MultiExcelUploadProps {
  setNamedSchedules: (namedSchedules: [string, Schedule][]) => void;
}

function onUpload(e: any, setSchedule: (schedule: Schedule) => any) {
  if (e != null && e.target != null) {
    const file = e.target.files[0];
    excelToSchedule(file, setSchedule);
  }
}

export const ExcelUpload: React.FC<Props> = props => {
  return (
    <div>
      <Tooltip
        title="Auto-populate your schedule with your excel plan of study. Reach out to your advisor if you don't have it!"
        placement="bottom"
        arrow
      >
        <input
          id="upload"
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={e => onUpload(e, props.setSchedule)}
        />
      </Tooltip>
    </div>
  );
};

export const ExcelWorkbookUpload: React.FC<MultiExcelUploadProps> = ({
  setNamedSchedules,
}) => {
  const [uploadedFile, setUploadedFile] = useState();

  const onUpload = (e: any) => {
    if (e != null && e.target != null) {
      const file = e.target.files[0];
      excelToScheduleMultipleSheets(file, setNamedSchedules);
    }
  };

  return (
    <div>
      <Tooltip
        title="Import multiple schedules from an Excel workbook."
        placement="bottom"
        arrow
      >
        <input
          id="upload"
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={e => onUpload(e)}
        />
      </Tooltip>
    </div>
  );
};
