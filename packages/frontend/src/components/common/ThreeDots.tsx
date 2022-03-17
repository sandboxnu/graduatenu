import * as React from "react";
import { IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

interface ThreeDotsProps {
  onClick: (event: any) => void;
}

export const ThreeDots: React.SFC<ThreeDotsProps> = (props) => {
  return (
    <IconButton onClick={props.onClick}>
      <MoreVertIcon color="action"></MoreVertIcon>
    </IconButton>
  );
};
