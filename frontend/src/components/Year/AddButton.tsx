import * as React from "react";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

interface AddButtonProps {
  onClick?: () => void;
}

export const AddButton: React.SFC<AddButtonProps> = props => {
  return (
    <Fab color="primary" aria-label="add" size="small" onClick={props.onClick}>
      <AddIcon />
    </Fab>
  );
};
