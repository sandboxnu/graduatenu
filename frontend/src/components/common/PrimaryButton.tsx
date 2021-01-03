import React from "react";
import { Button, Tooltip } from "@material-ui/core";
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
    "&.Mui-disabled": {
      pointerEvents: "auto",
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

export function PrimaryButton(props: any) {
  const classes = useStyles();
  return (
    <ColorButton
      variant="contained"
      color="primary"
      className={classes.margin}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </ColorButton>
  );
}

interface PrimaryButtonWithTooltipProps {
  tooltipText: string;
  disabled: boolean;
  onClick: () => void;
}

export const PrimaryButtonWithTooltip: React.FC<PrimaryButtonWithTooltipProps> = ({
  tooltipText,
  disabled,
  onClick,
  children,
}) => {
  const adjustedButtonProps = {
    disabled: disabled,
    component: disabled ? "div" : undefined,
    onClick: disabled ? undefined : onClick,
  };
  return (
    <Tooltip title={tooltipText}>
      <ColorButton {...adjustedButtonProps} variant="contained" color="primary">
        {children}
      </ColorButton>
    </Tooltip>
  );
};
