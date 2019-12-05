import React from "react";
import { Button } from "@material-ui/core";

export const NextButton: React.FC = () => {
  return (
    <Button
      variant="contained"
      color="secondary"
      style={{ marginTop: 12, marginBottom: 12 }}
    >
      Next
    </Button>
  );
};
