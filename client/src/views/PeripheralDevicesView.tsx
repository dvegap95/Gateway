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
import { CardContent, Tooltip } from "@mui/material";

const endpoint = "/api/peripheral-devices";

const StyledCard = styled(Card)`
  cursor: pointer;
  border: 2px dashed gray;
  height: 90px;
`;

export default function PeripheralDevicesView() {
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
    if (editedDevice._id) {
      custom_axios
        .patch(endpoint + "/" + editedDevice._id, editedDevice)
        .then((res) => {
          let index = data.findIndex((el) => {
            return el._id === res.data._id;
          });
          if (index >= 0) {
            Object.assign((data[index] = res.data));
          }
          setData([...data]);
          setLoading(false);
          setEditing(false);
          toast("Successfully edited!");
        })
        .catch((e) => {
          errorToast(e.message || JSON.stringify(e));
          setLoading(false);
          setEditing(false);
        });
    } else {
      custom_axios
        .post(endpoint, editedDevice)
        .then((res) => {
          let d = [...data];
          setData(d.concat([res.data]));
          setEditing(false);
          setLoading(false);
          toast("Successfully created!");
        })
        .catch((e) => {
          errorToast(e.message || JSON.stringify(e));
          setLoading(false);
          setEditing(false);
        });
    }
  }

  function handleDelete(device: PeripheralDevice) {
    custom_axios
      .delete(endpoint + "/" + device._id)
      .then((res) => {
        let index = data.findIndex((el) => {
          return el._id === res.data._id;
        });
        if (index >= 0) {
          data.splice(index, 1);
        }
        setData([...data]);
        setLoading(false);
        setEditing(false);
        toast("Successfully deleted");
      })
      .catch((e) => {
        errorToast(e.message || JSON.stringify(e));
        setLoading(false);
        setEditing(false);
      });
  }
  return (
    <div>
      {loading && <Loading open={loading} />}
      {data.map((device) => (
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
      ))}
      <Tooltip title="Create...">
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
    </div>
  );
}
