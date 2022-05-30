import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function ConfirmDialog(props: {
  onConfirm: Function;
  onCancel: Function;
  title?: string;
  open: boolean;
}) {
  return (
    <Dialog open={props.open}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogActions>
        <Button
          autoFocus
          variant="outlined"
          onClick={() => props.onConfirm && props.onConfirm()}
        >
          Confirm
        </Button>
        <Button
          onClick={() => props.onCancel && props.onCancel()}
          variant="outlined"
          color="error"
          autoFocus
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
