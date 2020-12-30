import React from "react";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

export enum ALERT_STATUS {
  None,
  Success,
  Error,
}

interface Props {
  alertStatus: ALERT_STATUS;
  handleClose: () => void;
  successMsg?: string;
}

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const SnackbarAlert = (props: Props) => {
  return (
    <Snackbar
      open={props.alertStatus !== ALERT_STATUS.None}
      autoHideDuration={6000}
      onClose={props.handleClose}
    >
      <Alert
        onClose={props.handleClose}
        severity={
          props.alertStatus === ALERT_STATUS.Error ? "error" : "success"
        }
      >
        {props.alertStatus === ALERT_STATUS.Error
          ? "Uh oh, something went wrong, try again!"
          : props.successMsg
          ? props.successMsg
          : "Success"}
      </Alert>
    </Snackbar>
  );
};
