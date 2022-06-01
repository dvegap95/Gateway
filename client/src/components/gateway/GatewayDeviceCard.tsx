import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "../common/Loading";
import PeripheralDeviceCard, {
  StyledCard as Card,
} from "../peripheral_device/PeripheralDeviceCard";
import custom_axios from "../../utils/custom_axios";
import { PeripheralDevice } from "../../entities/entities";
import toast, { errorToast } from "../../utils/toast";
import PeripheralDeviceEditDialog from "../peripheral_device/PeripheralDeviceEditDialog";
import { Add, Delete } from "@mui/icons-material";
import {
  CardContent,
  CardProps,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
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

export default function GatewayDeviceCard(
  props: CardProps & {
    device?: PeripheralDevice;
    gatewayId: string;
    filter?: (d: PeripheralDevice) => boolean;
    onAdd?: (d: PeripheralDevice) => void;
    onDelete?: (d: PeripheralDevice) => void;
  }
) {
  const [loading, setLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState({} as PeripheralDevice);

  const endpoint = `/api/gateways/${props.gatewayId}/device`;

  function handleAdd() {
    setLoading(true);
    custom_axios
      .post(endpoint, selectedDevice)
      .then((res) => {
        setLoading(false);
        toast("Successfully added!");
        setSelectedDevice({} as PeripheralDevice);
        props.onAdd && props.onAdd(res.data);
      })
      .catch((e) => {
        errorToast(e.message || JSON.stringify(e));
        setLoading(false);
      });
  }

  function handleDelete(
    device: PeripheralDevice = props.device as PeripheralDevice
  ) {
    setLoading(true);
    custom_axios
      .delete(endpoint + "/" + device._id)
      .then((res) => {
        setLoading(false);
        toast("Successfully deleted");
        props.onDelete && props.onDelete(res.data);
      })
      .catch((e) => {
        errorToast(e.message || JSON.stringify(e));
        setLoading(false);
      });
  }
  return (
    <StyledCard {...props}>
      {props.device ? (
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
        {loading ? (
          <CircularProgress size="30px" />
        ) : props.device ? (
          <IconButton
            onClick={() =>
              props.gatewayId
                ? handleDelete()
                : props.onDelete &&
                  props.onDelete(props.device as PeripheralDevice)
            }
          >
            <Delete />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => {
              props.gatewayId
                ? handleAdd()
                : props.onAdd && props.onAdd(selectedDevice);
              setSelectedDevice({} as PeripheralDevice);
            }}
            disabled={!selectedDevice._id}
          >
            <Add />
          </IconButton>
        )}
      </StyledCardActions>
    </StyledCard>
  );
}
