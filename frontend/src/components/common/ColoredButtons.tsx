import React from "react";
import { Button } from "@material-ui/core";
import { withStyles, Theme } from "@material-ui/core/styles";
import { NORTHEASTERN_RED } from "../../constants";

export const RedColorButton = withStyles((theme: Theme) => ({
  root: {
    color: "#ffffff",
    backgroundColor: NORTHEASTERN_RED,
    "&:hover": {
      backgroundColor: "#DB4747",
    },

    "&$disabled": {
      backgroundColor: "#c5c5c5",
      color: "white",
    },
  },
  disabled: {},
}))(Button);

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
