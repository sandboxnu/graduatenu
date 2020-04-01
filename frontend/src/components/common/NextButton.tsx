import React from "react";
import { Button } from "@material-ui/core";
import { red, green, blue, grey } from "@material-ui/core/colors";

export const NextButton: React.FC = () => {
  return (
    <Button
      variant="contained"
      color="secondary"
      style={{
        maxWidth: "100px",
        maxHeight: "36px",
        minWidth: "100px",
        minHeight: "36px",
        backgroundColor: "#EB5757",
        marginTop: 24,
        marginBottom: 12,
      }}
    >
      Next
    </Button>
  );
};
