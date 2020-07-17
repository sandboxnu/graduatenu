import React from "react";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import { MenuItem } from "@material-ui/core";
import { Status } from "graduate-common";

interface Props {
  status: Status;
  onChange: (event: any) => void;
  year: number;
}

const Container = withStyles(theme => ({
  root: {
    color: "white",
    marginTop: "2px",
    marginLeft: "4px",
  },
  icon: {
    color: "white",
    marginTop: "1px",
  },
}))(Select);

const SemesterTypeInput = withStyles(theme => ({
  root: {
    color: "#FFFFFF",
  },
  input: {
    color: "#FFFFFF",
    position: "relative",
    fontSize: 16,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

export const SemesterType: React.SFC<Props> = props => {
  return (
    <Container
      id="simple-menu"
      value={props.status}
      input={<SemesterTypeInput />}
      onChange={(event: any) => props.onChange(event)}
    >
      <MenuItem value={"CLASSES"}>Classes</MenuItem>
      <MenuItem value={"COOP"} disabled={props.year === 1}>
        Co-op
      </MenuItem>
      <MenuItem value={"INACTIVE"}>Vacation</MenuItem>
    </Container>
  );
};
