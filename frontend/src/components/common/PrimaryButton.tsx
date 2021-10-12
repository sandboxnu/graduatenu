import React from "react";
import { Button } from "@material-ui/core";
import { withStyles, Theme } from "@material-ui/core/styles";

const ColorButton = withStyles((_theme: Theme) => ({
  root: {
    color: "#ffffff",
    paddingVertical: "8px",
    paddingHorizontal: "16px",
    backgroundColor: "#EB5757",
    "&:hover": {
      backgroundColor: "#DB4747",
    },
    "&.Mui-disabled": {
      pointerEvents: "auto",
    },
  },
}))(Button);

const SecondaryColorButton = withStyles((_theme: Theme) => ({
  root: {
    color: "#EB5757",
    borderColor: "#EB5757",
    paddingVertical: "8px",
    paddingHorizontal: "16px",
    backgroundColor: "#ffffff",
    "&:hover": {
      backgroundColor: "#DB4747",
      color: "#ffffff",
    },
    "&.Mui-disabled": {
      pointerEvents: "auto",
    },
  },
}))(Button);

export function PrimaryButton(props: any) {
  return (
    <ColorButton
      variant="contained"
      color="primary"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </ColorButton>
  );
}

export function SecondaryButton(props: any) {
  return (
    <SecondaryColorButton
      variant="contained"
      color="primary"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </SecondaryColorButton>
  );
}
