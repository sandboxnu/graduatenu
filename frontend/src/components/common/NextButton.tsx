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
    width: "100px",
    height: "36px",
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

export const NextButton: React.FC = () => {
  const classes = useStyles();
  return (
    <ColorButton variant="contained" color="primary" className={classes.margin}>
      Next
    </ColorButton>
  );
};
