import React from "react";
import { WhiteColorButton } from "../common/ColoredButtons";

export const AddSemesterButton = () => {
  return (
    <WhiteColorButton
      variant="contained"
      style={{
        width: "24%",
        border: "1px solid #eb5757",
        marginBottom: "28px",
        boxShadow: "0 0 1px rgb(255 255 255 / 50%)",
        borderRadius: "0",
      }}
    >
      + Add Semester
    </WhiteColorButton>
  );
};
