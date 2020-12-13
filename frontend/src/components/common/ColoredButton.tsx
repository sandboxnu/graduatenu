import React from "react";
import { Button } from "@material-ui/core";
import { withStyles, Theme } from "@material-ui/core/styles";

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
