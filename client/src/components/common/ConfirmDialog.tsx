import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

//Intermediate dialog for action confirmation
export default function ConfirmDialog(props: {
  onConfirm: Function; //confirm callback (User clicks accept button)
  onCancel: Function; //cancel callback (Dialog closes without accept being clicked)
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
          onClick={() => props.onConfirm && props.onConfirm()} //confirm
        >
          Confirm
        </Button>
        <Button
          onClick={() => props.onCancel && props.onCancel()} //cancel
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
