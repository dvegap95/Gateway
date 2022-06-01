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

//Peripheral device selector which also allows to create peripheral devices
export default function PeripheralDeviceSelect(
  props: FormControlProps & {
    value: PeripheralDevice; //currently selected device (for controlled component)
    onValueChange: (dev: PeripheralDevice) => void; //value change callback (for controlled component)
    label: string;
    //allows to filter devices available for selection so already selected can be omitted
    filter?: (el: PeripheralDevice) => boolean;
  }
) {
  const [loading, setLoading] = useState(true);
  //store fetched peripheral devices
  const [data, setData] = useState(new Array<PeripheralDevice>());
  //model peripheral device for the edit/create dialog (create only for this component)
  const [editedDevice, setEditedDevice] = useState({} as PeripheralDevice);
  //edition dialog open control
  const [editing, setEditing] = useState(false);

  //fetch peripheral devices once
  useEffect(() => {
    custom_axios
      .get(endpoint)
      .then((res) => {
        setData(res.data); //store fetched devices
        setLoading(false); //stop loading (which is true by default)
        //success is required for the component to work, so it won't be notified
      })
      .catch((e) => {
        errorToast(e.message || "Connection Error"); //notify error
        setLoading(false);
      });
  }, []);

  //handle create dialog accepted
  function handleAccept() {
    setLoading(true);
    custom_axios
      .post(endpoint, editedDevice)
      .then((res) => {
        //add element to local peripheral devices and update stored peripheral devices status
        let d = [...data]; 
        setData(d.concat([res.data])); 
        
        setEditing(false); //close dialog
        setLoading(false);
        props.onValueChange(res.data); //notify to parent component
        toast("Successfully created!"); //notify success
      })
      .catch((e) => {
        errorToast(e.message || JSON.stringify(e)); //notify error
        setLoading(false);
        setEditing(false);
      });
  }

  //handle peripheral device selection
  function handleSelect(id: string) {
    //receives selected id
    if (!id) props.onValueChange({} as PeripheralDevice); //notify an empty object if no id

    //ignore this particular id since it's for "Create..."
    //option which has it's own click event handler
    if (id === "_create_") return;

    let sel = data.find((el) => el._id === id); //find element by id
    if (!sel) return; //sel shouldn't be falsy but if it is, ignore it
    props.onValueChange && sel && props.onValueChange(sel); //notify selection to parent
  }

  return (
    <FormControl {...props}>
      {props.label && (
        <InputLabel id="device-select-label">{props.label}</InputLabel>
      )}
      <Select
        labelId="device-select-label"
        onChange={(e) => {
          handleSelect(e.target?.value as string);
        }}
        value={props.value._id || ""}
        color="grey"
      >
        {data
          .filter(
            //here's where props.filter is applied
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
      </Select>
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
