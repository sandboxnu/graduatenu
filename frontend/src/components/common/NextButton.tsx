import React from "react";
import { Button } from "@material-ui/core";
import {
  createStyles,
  withStyles,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";

const ColorButton = withStyles((theme: Theme) => ({
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginTop: "24px",
    },
  })
);

interface Props {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const NextButton: React.FC<Props> = props => {
  const classes = useStyles();
  return (
    <ColorButton
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
