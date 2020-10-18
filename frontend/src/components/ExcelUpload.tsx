import * as React from "react";
import { excelToSchedule } from "../utils/excelParser";
import { Schedule } from "../../../common/types";
import styled from "styled-components";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";

const Container = styled.div`
  position: relative;
  justify-content: left;
  padding: 0px;
  margin: 0px;
`;

interface Props {
  setSchedule: (schedule: Schedule) => void;
  setSelectOption: (selectState: string) => void;
}

function onUpload(
  e: any,
  setSchedule: (schedule: Schedule) => any,
  setSelectOption: () => void
) {
  if (e != null && e.target != null) {
    const file = e.target.files[0];
    excelToSchedule(file, setSchedule);
  }
  setSelectOption();
}

export const ExcelUpload: React.FC<Props> = props => {
  return (
    <Tooltip
      title="Auto-populate your schedule with your excel plan of study. Reach out to your advisor if you don't have it!"
      placement="bottom"
      arrow
    >
      <>
        <input
          id="upload"
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          style={{ display: "none" }}
          onChange={e =>
            onUpload(e, props.setSchedule, () =>
              props.setSelectOption("kill me")
            )
          }
        />
        {props.children}
      </>
    </Tooltip>
  );
};
