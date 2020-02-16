import * as React from "react";
import { Fab, IconButton, Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import styled from "styled-components";

const AddButtonWrapper = styled.div`
  background-color: grey;
  margin-left: 4px;
  border-radius: 50%;
`;

interface SidebarAddButtonProps {
  onClick?: () => void;
}

export const SidebarAddButton: React.SFC<SidebarAddButtonProps> = props => {
  return (
    <AddButtonWrapper>
      <IconButton color="inherit" size="small" onClick={props.onClick}>
        <AddIcon fontSize="inherit" />
      </IconButton>
    </AddButtonWrapper>
  );
};
