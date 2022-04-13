import React from "react";
import { Button } from "@material-ui/core";
import {
  createStyles,
  withStyles,
  makeStyles,
} from "@material-ui/core/styles";

const ColorButton = withStyles(() => ({
  root: {
    color: "#ffffff",
    paddingVertical: "8px",
    paddingHorizontal: "16px",
    backgroundColor: "#EB5757",
    "&:hover": {
      backgroundColor: "#DB4747",
    },
  },
}))(Button);

const useStyles = makeStyles(() =>
  createStyles({
    margin: {
      marginTop: "24px",
    },
  })
);

interface Props {
  type?: "button" | "reset" | "submit" | undefined;
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const NextButton: React.FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <ColorButton
      type={props.type || undefined}
      variant="contained"
      color="primary"
      className={classes.margin}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.text || "Next"}
    </ColorButton>
  );
};
