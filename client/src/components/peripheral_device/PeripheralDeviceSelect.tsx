import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "../common/Loading";
import PeripheralDeviceCard, {
  StyledCard as Card,
} from "./PeripheralDeviceCard";
import custom_axios from "../../utils/custom_axios";
import { PeripheralDevice } from "../../entities/entities";
import toast, { errorToast } from "../../utils/toast";
import PeripheralDeviceEditDialog from "./PeripheralDeviceEditDialog";
import { Add, Delete } from "@mui/icons-material";
import {
  CardContent,
  CircularProgress,
  FormControl,
  FormControlProps,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";

const endpoint = "/api/peripheral-devices";

const StyledSelect = styled(Select)`
  border: none;
`;

export default function PeripheralDeviceSelect(
  props: FormControlProps & {
    value: PeripheralDevice;
    onValueChange: (dev: PeripheralDevice) => void;
    fullWidth?: boolean;
    label: string;
    filter?: (el: PeripheralDevice) => boolean;
  }
) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(new Array<PeripheralDevice>());
  const [editedDevice, setEditedDevice] = useState({} as PeripheralDevice);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    custom_axios
      .get(endpoint)
      .then((res) => {
        console.log({ res });
        setData(res.data);
        setLoading(false);
      })
      .catch((e) => {
        errorToast(e.message || "Connection Error");
        setLoading(false);
      });
  }, []);

  function handleAccept() {
    setLoading(true);
    custom_axios
      .post(endpoint, editedDevice)
      .then((res) => {
        let d = [...data];
        setData(d.concat([res.data]));
        setEditing(false);
        setLoading(false);
        props.onValueChange(res.data);
        toast("Successfully created!");
      })
      .catch((e) => {
        errorToast(e.message || JSON.stringify(e));
        setLoading(false);
        setEditing(false);
      });
  }

  function handleSelect(id: string) {
    if (!id) props.onValueChange({} as PeripheralDevice);
    if (id === "_create_") return;
    let sel = data.find((el) => el._id === id);
    if (!sel) return;
    props.onValueChange && sel && props.onValueChange(sel);
  }

  return (
    <FormControl {...props}>
      {props.label && (
        <InputLabel id="device-select-label">{props.label}</InputLabel>
      )}
      <StyledSelect
        labelId="device-select-label"
        onChange={(e) => {
          handleSelect(e.target?.value as string);
        }}
        value={props.value._id || ""}
      >
        {data
          .filter(
            props.filter ||
              function (d) {
                return true;
              }
          )
          .map((device) => (
            <MenuItem value={device._id} key={device._id}>
              {device.uid + " - " + device.vendor}
            </MenuItem>
          ))}
        <MenuItem
          value={"_create_"}
          onClick={() => {
            setEditedDevice({} as PeripheralDevice);
            setEditing(true);
          }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Create..."}
        </MenuItem>
      </StyledSelect>
      <PeripheralDeviceEditDialog
        open={editing}
        device={editedDevice}
        onValueChange={setEditedDevice}
        onCancel={() => setEditing(false)}
        onAccept={handleAccept}
      />
    </FormControl>
  );
}
