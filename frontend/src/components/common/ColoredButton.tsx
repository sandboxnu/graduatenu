import React from "react";
import { Button } from "@material-ui/core";
import { withStyles, Theme } from "@material-ui/core/styles";
import { NORTHEASTERN_RED } from "../../constants";

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: "#ffffff",
    backgroundColor: "#EB5757",
    "&:hover": {
      backgroundColor: "#DB4747",
    },
  },
}))(Button);

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export const ColoredButton: React.FC<Props> = props => {
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
};

// We need to do some abstraction of buttons around the app.
export const WhiteColorButton = withStyles((theme: Theme) => ({
  root: {
    marginRight: "20px",
    border: "1px solid red",
    color: NORTHEASTERN_RED,
    backgroundColor: "#ffffff",
    "&:hover": {
      backgroundColor: "#e9e9e9",
    },
  },
}))(Button);

export const GenericColorButton = (
  backgroundColor: string,
  hoverBackgroundColor: string
) =>
  withStyles((theme: Theme) => ({
    root: {
      color: "#ffffff",
      backgroundColor: backgroundColor,
      "&:hover": {
        backgroundColor: hoverBackgroundColor,
      },
    },
  }))(Button);

export const RedColorButton = GenericColorButton(NORTHEASTERN_RED, "#DB4747");
