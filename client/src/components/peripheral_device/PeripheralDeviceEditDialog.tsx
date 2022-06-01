import React, { useState } from "react";
import { PeripheralDevice } from "../../entities/entities";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import styled from "styled-components";
import CrudTextEdit from "../common/CrudTextEdit";
import CrudSelectEdit from "../common/CrudSelectEdit";
import CrudDateEdit from "../common/CrudDateEdit";

const StyledFormControl = styled.div`
  margin: 20px;
  max-width: 500px;
  min-width: 250px;
`;

export default function PeripheralDeviceEditDialog(props: {
  device: PeripheralDevice; //device value for controlled component
  onValueChange: (device: PeripheralDevice) => void; //callback for controlled component
  open: boolean; //mui Dialog open prop
  onCancel: () => void; //cancel callback
  onAccept: () => void; //accept callback
}) {
  //retrieve breakpoint configuration from theme to determine wether
  //the dialog should render in fullscreen mode
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  //controls individual field errors for general form validation
  const [error, setError] = useState({} as any);

  const { device } = props;
  return (
    <Dialog open={props.open} fullScreen={fullScreen}>
      <DialogTitle data-testid="dialog_title_edit">
        {device._id ? "Edit device" : "Create device"}
      </DialogTitle>
      <DialogContent>
        <StyledFormControl>
          <CrudTextEdit
            element={device}
            propname="uid"
            label="UID"
            onValueChange={props.onValueChange}
            rules={[
              //uid validation rules (it should be a positive integer)
              (val: any) =>
                (Number.isInteger(+val) && !("" + val).includes(".")) ||
                "Value must be an Integer",
              (val: any) =>
                Number.isSafeInteger(+val) || "Value too long for an Integer",
              (val: any) => +val >= 0 || "Value must be positive",
            ]}
            cantBeWrong
            fullWidth
            transform={(v: string | undefined) => (v ? +v : null)} //uid field should be a number
            onErrorChange={(e: string | boolean) => {
              let err = { ...error };
              if (!e) {
                delete err.uid;
              } else {
                err.uid = e;
              }
              setError({ ...err }); //handle input error
            }}
            data-testid="uid_edit"
          />
        </StyledFormControl>
        <StyledFormControl>
          <CrudTextEdit
            element={device}
            propname="vendor"
            label="Vendor"
            onValueChange={props.onValueChange}
            fullWidth
          />
        </StyledFormControl>
        <StyledFormControl>
          <CrudSelectEdit
            element={device}
            propname="status"
            label="Status"
            onChange={props.onValueChange}
            items={["online", "offline"]} //all 2 possible statuses of the device
            default="offline"
            fullWidth
          />
        </StyledFormControl>
        <StyledFormControl>
          <CrudDateEdit
            label="Created"
            element={device}
            propname="created"
            onValueChange={props.onValueChange}
            fullWidth
          />
        </StyledFormControl>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          variant="outlined"
          onClick={props.onAccept}
          //disabled if any field triggered any error (error !== {})
          disabled={!!Object.entries(error).length}
        >
          Accept
        </Button>
        <Button
          onClick={props.onCancel}
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
