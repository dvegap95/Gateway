import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "../components/common/Loading";
import PeripheralDeviceCard, {
  StyledCard as Card,
} from "../components/peripheral_device/PeripheralDeviceCard";
import custom_axios from "../utils/custom_axios";
import { PeripheralDevice } from "../entities/entities";
import toast, { errorToast } from "../utils/toast";
import PeripheralDeviceEditDialog from "../components/peripheral_device/PeripheralDeviceEditDialog";
import { Add } from "@mui/icons-material";
import CardContent from "@mui/material/CardContent";
import Tooltip from "@mui/material/Tooltip";

const endpoint = "/api/peripheral-devices";

const StyledCard = styled(Card)`
  cursor: pointer;
  border: 2px dashed gray;
  height: 90px;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-items: center;
  margin: auto;
  justify-content: center;
`;
//peripheral devices crud
export default function PeripheralDevicesView() {
  const [loading, setLoading] = useState(true); //loading state control
  //store fetched peripheral devices
  const [data, setData] = useState(new Array<PeripheralDevice>());
  //model peripheral device for the edit/create dialog
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

  //handle edit dialog accepted
  function handleAccept() {
    setLoading(true);
    //is edited device an already existent element?
    if (editedDevice._id) {
      custom_axios
        .patch(endpoint + "/" + editedDevice._id, editedDevice) //use patch endpoint
        .then((res) => {
          let index = data.findIndex((el) => {
            return el._id === res.data._id;
          }); //find patched device in the local stored device list
          if (index >= 0) {
            Object.assign((data[index] = res.data)); //update it
          }
          setData([...data]); //update state
          setLoading(false);
          setEditing(false); //close dialog
          toast("Successfully edited!"); //notify success
        })
        .catch((e) => {
          errorToast(e.message || JSON.stringify(e)); //notify error
          setLoading(false);
          setEditing(false);
        });
    } else {
      custom_axios
        .post(endpoint, editedDevice)
        .then((res) => {
          //add element to local peripheral devices and update stored peripheral devices status
          let d = [...data];
          setData(d.concat([res.data]));

          setEditing(false); //close dialog
          setLoading(false);
          toast("Successfully created!"); //notify success
        })
        .catch((e) => {
          errorToast(e.message || JSON.stringify(e)); //notify error
          setLoading(false);
          setEditing(false);
        });
    }
  }

  //handle delete Peripheral device
  function handleDelete(device: PeripheralDevice) {
    custom_axios
      .delete(endpoint + "/" + device._id) //delete request to api
      .then((res) => {
        let index = data.findIndex((el) => {
          return el._id === res.data._id;
        }); //find deleted device in local stored list
        if (index >= 0) {
          data.splice(index, 1); //remove it if found
        }
        setData([...data]); //update list
        setLoading(false);
        setEditing(false); //close dialog
        toast("Successfully deleted"); //notify success
      })
      .catch((e) => {
        errorToast(e.message || JSON.stringify(e)); //notify error
        setLoading(false);
        setEditing(false);
      });
  }
  return (
    <Container>
      {loading && <Loading open={loading} />}
      {!data?.length ? (
        <div
          style={{
            fontSize: "small",
            textAlign: "center",
            margin: "10% 10px",
            width: "100%",
          }}
        >
          No peripheral devices
        </div>
      ) : (
        data.map((device) => (
          <PeripheralDeviceCard
            device={device}
            key={device._id}
            onEdit={(device) => {
              setEditedDevice(device);
              setEditing(true);
            }}
            onDelete={(device) => {
              handleDelete(device);
            }}
          />
        ))
      )}
      <Tooltip title="Create device...">
        <StyledCard
          onClick={() => {
            setEditedDevice({} as PeripheralDevice);
            setEditing(true);
          }}
        >
          <CardContent
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              height: "100%",
              boxSizing: "border-box",
              textAlign: "center",
            }}
            data-testid="peripheral_device_add_card"
          >
            <Add />
          </CardContent>
        </StyledCard>
      </Tooltip>
      <PeripheralDeviceEditDialog
        open={editing}
        device={editedDevice}
        onValueChange={setEditedDevice}
        onCancel={() => setEditing(false)}
        onAccept={handleAccept}
      />
    </Container>
  );
}
