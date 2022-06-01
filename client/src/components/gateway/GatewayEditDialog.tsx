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
import GatewayDeviceCard from "./GatewayDeviceCard";
import { errorToast } from "../../utils/toast";

const StyledFormControl = styled.div`
  margin: 10px 5px;
  max-width: 500px;
  min-width: 200px;
`;

const StyledFormControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-width: 500px;
  min-width: ${(props: { fullScreen: boolean }) =>
    props.fullScreen ? "290px" : "20px"};
`;

const ScrollView = styled.div`
  overflow-y: auto;
  max-height: ${(props: { fullScreen: boolean }) =>
    props.fullScreen ? "calc(100vh - 460px)" : "230px"};
  min-height: 230px;
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  ${(props: { fullScreen: boolean }) =>
    props.fullScreen
      ? `
    align-items:center;
    flex-direction:column;
    `
      : `
      flex-direction:row
      align-items:flex-start;
      `};
`;

const GatewayDevicesView = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: auto;
  width: 280px;
  margin-top: 10px;
`;
const GatewayDevicesLabel = styled.div`
  background: white;
  margin: -15px 0 -5px 12px;
  font-size: small;
  width: fit-content;
  padding: 4px;
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
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Dialog open={props.open} fullScreen={fullScreen} maxWidth="lg">
      <DialogTitle data-testid="dialog_title_edit">
        {gateway._id ? "Edit gateway" : "Create gateway"}
      </DialogTitle>
      <StyledDialogContent fullScreen={fullScreen}>
        <StyledFormControlGroup fullScreen={fullScreen}>
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
        </StyledFormControlGroup>
        <GatewayDevicesView>
          <GatewayDevicesLabel>
            Devices [{gateway.devices?.length || 0}]
          </GatewayDevicesLabel>
          <ScrollView fullScreen={fullScreen}>
            {!gateway.devices?.length && (
              <div
                style={{
                  fontSize: "small",
                  textAlign: "center",
                  margin: "35% 10px",
                }}
              >
                No peripheral devices
              </div>
            )}
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
      </StyledDialogContent>
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
