import { Button, IconButton, Snackbar } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import { ScheduleCourse, courseToString } from "@graduate/common";

interface UndoDeleteProps {
  deletedClass: ScheduleCourse | undefined;
  snackbarOpen: boolean;
  handleSnackbarClose: (
    event: React.SyntheticEvent<any, Event>,
    reason: string
  ) => void;
  undoButtonPressed: () => void;
  closeSnackBar: () => void;
}

interface UndoDeleteState {
  snackbarOpen: boolean;
  deletedClass?: ScheduleCourse;
}

const OutsideContainer = styled.div`
  width: 25%;
`;

export class UndoDeleteComponent extends React.Component<
  UndoDeleteProps,
  UndoDeleteState
> {
  constructor(props: UndoDeleteProps) {
    super(props);
    this.state = {
      snackbarOpen: false,
      deletedClass: undefined,
    };
  }

  render() {
    return (
      <OutsideContainer>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.props.snackbarOpen}
          onClose={this.props.handleSnackbarClose}
          autoHideDuration={5000}
          message={
            <span>
              {!!this.props.deletedClass
                ? `Removed ${courseToString(this.props.deletedClass)}: ` +
                  this.props.deletedClass.name
                : "Removed Class"}
            </span>
          }
          action={[
            <Button
              key="undo"
              color="secondary"
              size="small"
              onClick={this.props.undoButtonPressed}
            >
              UNDO
            </Button>,
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={this.props.closeSnackBar}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </OutsideContainer>
    );
  }
}

export const UndoDelete = UndoDeleteComponent;
