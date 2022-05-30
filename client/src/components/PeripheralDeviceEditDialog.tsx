import React, { useState } from "react";
import { PeripheralDevice } from "../entities/entities";
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
import CrudTextEdit from "./common/CrudTextEdit";
import CrudSelectEdit from "./common/CrudSelectEdit";
import CrudDateEdit from "./common/CrudDateEdit";

const StyledFormControl = styled.div`
  margin: 20px;
  max-width: 500px;
  min-width: 250px;
`;

export default function PeripheralDeviceEditDialog(props: {
  device: PeripheralDevice;
  onChange: (device: PeripheralDevice) => void;
  open: boolean;
  onCancel: () => void;
  onAccept: () => void;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [error, setError] = useState({} as any);

  const { device } = props;
  return (
    <Dialog open={props.open} fullScreen={fullScreen}>
      <DialogTitle>{device._id ? "Edit device" : "Create device"}</DialogTitle>
      <DialogContent>
        <StyledFormControl>
          <CrudTextEdit
            element={device}
            value="uid"
            label="UID"
            onChange={props.onChange}
            rules={[
              (val: any) =>
                (Number.isSafeInteger(+val) && !("" + val).includes(".")) ||
                "Value must be an Integer",
              (val: any) => +val >= 0 || "Value must be positive",
            ]}
            cantBeWrong
            fullWidth
            transform={(v: string | undefined) => (v ? +v : null)}
            onErrorChange={(e) => {
              let err = { ...error };
              if (!e) {
                delete err.uid;
              } else {
                err.uid = e;
              }
              setError({ ...err });
            }}
          />
        </StyledFormControl>
        <StyledFormControl>
          <CrudTextEdit
            element={device}
            value="vendor"
            label="Vendor"
            onChange={props.onChange}
            fullWidth
          />
        </StyledFormControl>
        <StyledFormControl>
          <CrudSelectEdit
            element={device}
            value="status"
            label="Status"
            onChange={props.onChange}
            items={["online", "offline"]}
            default="offline"
            fullWidth
          />
        </StyledFormControl>
        <StyledFormControl>
          <CrudDateEdit
            label="Created"
            element={device}
            value="created"
            onChange={props.onChange}
            fullWidth
          />
        </StyledFormControl>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          variant="outlined"
          onClick={props.onAccept}
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
