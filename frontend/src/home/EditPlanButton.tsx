import * as React from "react";
import { IconButton } from "@material-ui/core";
import styled from "styled-components";
import EditIcon from "@material-ui/icons/Edit";

const EditPlanIcon = styled(EditIcon)<any>`
  color: #bdbdbd;
`;

interface EditPlanButtonProps {
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const EditPlanButton: React.SFC<EditPlanButtonProps> = props => {
  return (
    <IconButton color="inherit" size="small" onClick={props.onClick}>
      <EditPlanIcon fontSize="small" />
    </IconButton>
  );
};
