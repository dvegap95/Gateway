import React, { useState } from "react";
import { Gateway, PeripheralDevice } from "../../entities/entities";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  TextField,
} from "@mui/material";
import styled from "styled-components";
import CrudTextEdit from "../common/CrudTextEdit";
import CrudSelectEdit from "../common/CrudSelectEdit";
import CrudDateEdit from "../common/CrudDateEdit";
import GatewayDeviceCard from "./GatewayDeviceCard";
import { errorToast } from "../../utils/toast";
const StyledFormControl = styled.div`
  margin: 20px 5px;
  max-width: 500px;
  min-width: 250px;
`;

const ScrollView = styled.div`
  overflow-y: auto;
  max-height: calc(
    ${(props: { fullScreen: boolean }) => (props.fullScreen ? "100vh" : "80vh")} -
      460px
  );
  min-height: 200px;
`;

const GatewayDevicesView = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

export default function GatewayEditDialog(
  props: DialogProps & {
    gateway: Gateway; //gateway value for controlled component
    onValueChange: (gateway: Gateway) => void; //callback for controlled component
    open: boolean; //mui Dialog open prop
    onCancel: () => void; //cancel callback
    onAccept: () => void; //accept callback
  }
) {
  //retrieve breakpoint configuration from theme to determine wether
  //the dialog should render in fullscreen mode
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  //controls individual field errors for general form validation
  const [error, setError] = useState({} as any);

  const { gateway } = props;

  function handleDeleteDevice(device: PeripheralDevice) {
    let gw = { ...gateway };
    let index = gw.devices.findIndex((el) => {
      return el._id === device._id;
    });
    if (index >= 0) {
      gw.devices.splice(index, 1);
    }
    props.onValueChange(gw);
  }

  function handleAddDevice(device: PeripheralDevice) {
    if (gateway.devices?.length === 10) {
      return errorToast("No more than 10 devices allowed");
    }
    let gw = { ...gateway };
    if (!gw.devices) gw.devices = [];
    gw.devices.push(device);
    props.onValueChange(gw);
  }

  return (
    <Dialog open={props.open} fullScreen={fullScreen}>
      <DialogTitle data-testid="dialog_title_edit">
        {gateway._id ? "Edit gateway" : "Create gateway"}
      </DialogTitle>
      <DialogContent>
        <StyledFormControl>
          <CrudTextEdit
            element={gateway}
            propname="name"
            label="Name"
            onValueChange={props.onValueChange}
            fullWidth
            data-testid="name_edit"
          />
        </StyledFormControl>
        <StyledFormControl>
          <CrudTextEdit
            element={gateway}
            propname="ipAddress"
            label="IP"
            onValueChange={props.onValueChange}
            rules={[
              //ip validation rules (it should be a positive integer)
              (ip: any) => {
                //ip address validator (algorithm)
                let bytes = ip.split("."); //separates ip sections (bytes)
                return (
                  (bytes.length === 4 && //4 ip sections found
                    bytes.reduce((valid: boolean, currByte: string) => {
                      //validate each section
                      return (
                        valid && //is previous section valid?
                        !Number.isNaN(currByte) && //is current section a valid number?
                        Number.isInteger(+currByte) && //is current section an integer?
                        +currByte >= 0 &&
                        +currByte <= 255 // is current section value betwen 0 and 255?
                      );
                    }, true)) ||
                  "Invalid ip address"
                );
              },
            ]}
            fullWidth
            onErrorChange={(e: string | boolean) => {
              let err = { ...error };
              if (!e) {
                delete err.name;
              } else {
                err.name = e;
              }
              setError({ ...err }); //handle input error
            }}
          />
        </StyledFormControl>
        <StyledFormControl>
          <CrudTextEdit
            element={gateway}
            propname="serialNumber"
            label="SerialNumber"
            onValueChange={props.onValueChange}
            fullWidth
          />
        </StyledFormControl>
        <GatewayDevicesView>
          <div style={{ margin: "0 0 5px 11px" }}>
            devices [{+gateway.devices?.length}]
          </div>
          <ScrollView fullScreen={fullScreen}>
            {gateway.devices?.map((device) => (
              <GatewayDeviceCard
                device={device}
                gatewayId={gateway._id}
                key={device._id}
                onDelete={handleDeleteDevice}
                style={{ margin: "5px 10px" }}
              />
            ))}
          </ScrollView>
          <GatewayDeviceCard
            filter={(d) =>
              gateway.devices
                ? gateway.devices.findIndex((dev) => dev._id === d._id) === -1
                : true
            }
            onAdd={handleAddDevice}
            gatewayId={gateway._id}
            style={{ margin: 0 }}
          />
        </GatewayDevicesView>
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
