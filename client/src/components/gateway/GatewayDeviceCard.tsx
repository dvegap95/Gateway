import React, {  useState } from "react";
import styled from "styled-components";
import { CardProps } from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

import { StyledCard as Card } from "../peripheral_device/PeripheralDeviceCard";
import custom_axios from "../../utils/custom_axios";
import { PeripheralDevice } from "../../entities/entities";
import toast, { errorToast } from "../../utils/toast";
import { Add, Delete } from "@mui/icons-material";
import PeripheralDeviceSelect from "../peripheral_device/PeripheralDeviceSelect";

const StyledCard = styled(Card)`
  height: 40px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 0 2px 0 10px;
`;

const StyledCardContent = styled.div`
  display: inline-block;
`;
const StyledCardActions = styled.div`
  display: inline-block;
`;
//component for handling devices inside a gateway in edition mode
//if device is provided as prop, displays information and a delete icon button
//it renders a device selector and an add icon button otherwise
//TODO separate selector + add and information + delete functionalities in two different components
export default function GatewayDeviceCard(
  props: CardProps & {
    device?: PeripheralDevice; //information to display in the card
    gatewayId: string; //id of the gateway holding the devices
    filter?: (d: PeripheralDevice) => boolean; //function to discriminate existent devices from device list
    onAdd?: (d: PeripheralDevice) => void; //handle add device
    onDelete?: (d: PeripheralDevice) => void; //handle delete device
  }
) {
  const [loading, setLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState({} as PeripheralDevice);

  const endpoint = `/api/gateways/${props.gatewayId}/device`;

  //handle the addition of a peripheral device to an existent gateway using API
  function handleAddDevice() {
    setLoading(true);
    custom_axios
      .post(endpoint, selectedDevice)
      .then((res) => {
        setLoading(false);
        toast("Successfully added!"); //notify success
        setSelectedDevice({} as PeripheralDevice); //clear device select
        props.onAdd && props.onAdd(res.data); //notify to parent
      })
      .catch((e) => {
        errorToast(e.message || JSON.stringify(e)); //notify error
        setLoading(false);
      });
  }

  //handle the deletion of a peripheral device from an existent gateway via API
  function handleDelete(
    device: PeripheralDevice = props.device as PeripheralDevice
  ) {
    setLoading(true);
    custom_axios
      .delete(endpoint + "/" + device._id)
      .then((res) => {
        setLoading(false);
        toast("Successfully deleted"); //notify success
        props.onDelete && props.onDelete(res.data); //notify to parent
      })
      .catch((e) => {
        errorToast(e.message || JSON.stringify(e)); //notify error
        setLoading(false);
      });
  }
  return (
    <StyledCard {...props}>
      {props.device ? ( // select the card variant depending on device prop
        <StyledCardContent>
          {props.device.uid + " - " + props.device.vendor}
        </StyledCardContent>
      ) : (
        <PeripheralDeviceSelect
          onValueChange={setSelectedDevice}
          filter={props.filter}
          value={selectedDevice}
          label="Add a device..."
          style={{ margin: -15, width: "90%" }}
        />
      )}
      <StyledCardActions>
        {loading ? ( //display circular indeterminate progress if loading, action icon button otherwise
          <CircularProgress size="30px" />
        ) : props.device ? (
          <IconButton
            onClick={
              () =>
                //no gatewayId would mean it's being created, so no api calls can be targeted to it
                props.gatewayId
                  ? handleDelete()
                  : props.onDelete &&
                    props.onDelete(props.device as PeripheralDevice) //directly handle delete PeripheralDevice by parent
            }
            data-testid="delete_btn"
          >
            <Delete />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => {
              //no gatewayId would mean it's being created, so no api calls can be targeted to it
              props.gatewayId
                ? handleAddDevice()
                : props.onAdd && props.onAdd(selectedDevice); //directly handle add PeripheralDevice by parent
              setSelectedDevice({} as PeripheralDevice);
            }}
            disabled={!selectedDevice._id} //disable add if no device is selected
            data-testid="add_btn"
          >
            <Add />
          </IconButton>
        )}
      </StyledCardActions>
    </StyledCard>
  );
}
