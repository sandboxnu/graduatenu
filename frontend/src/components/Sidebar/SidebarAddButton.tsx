import * as React from "react";
import { IconButton } from "@material-ui/core";
import styled from "styled-components";
import AddBoxIcon from "@material-ui/icons/AddBox";

const AddButtonIcon = styled(AddBoxIcon)<any>`
  color: #eb5757;
`;

interface SidebarAddButtonProps {
  onClick?: () => void;
}

export const SidebarAddButton: React.SFC<SidebarAddButtonProps> = props => {
  return (
    <IconButton color="inherit" size="small" onClick={props.onClick}>
      <AddButtonIcon fontSize="inherit" size="small" onClick={props.onClick} />
    </IconButton>
  );
};
