import { Button } from "@material-ui/core";
import { withStyles, Theme } from "@material-ui/core/styles";
import { NORTHEASTERN_RED } from "../../constants";

export const WhiteColorButton = withStyles((theme: Theme) => ({
  root: {
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
      "&$disabled": {
        backgroundColor: "#c5c5c5",
        color: "white",
      },
    },

    disabled: {},
  }))(Button);

export const RedColorButton = GenericColorButton(NORTHEASTERN_RED, "#DB4747");
