import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "../components/common/Loading";
import GatewayCard, {
  StyledCard as Card,
} from "../components/gateway/GatewayCard";
import custom_axios from "../utils/custom_axios";
import { Gateway } from "../entities/entities";
import toast, { errorToast } from "../utils/toast";
import GatewayEditDialog from "../components/gateway/GatewayEditDialog";
import { Add } from "@mui/icons-material";
import { CardContent, Tooltip } from "@mui/material";

const endpoint = "/api/gateways";

const StyledCard = styled(Card)`
  cursor: pointer;
  border: 2px dashed gray;
  height: 90px;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-items: center;
  justify-content: center;
`;

//gateway crud
export default function GatewayView() {
  const [loading, setLoading] = useState(true); //loading control
  //store fetched gateways
  const [data, setData] = useState(new Array<Gateway>());
  //model gateway for the edit/create dialog
  const [editedGateway, setEditedGateway] = useState({} as Gateway);
  //edition dialog open control
  const [editing, setEditing] = useState(false);

  //fetch gateways once
  useEffect(() => {
    custom_axios
      .get(endpoint)
      .then((res) => {
        console.log({ res });
        setData(res.data); //store fetched gateways
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
    //is edited gateway an already existent element?
    if (editedGateway._id) {
      custom_axios
        .patch(endpoint + "/" + editedGateway._id, editedGateway) //use patch endpoint
        .then((res) => {
          let index = data.findIndex((el) => {
            return el._id === res.data._id;
          }); //find patched gateway in the local stored gateway list
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
        .post(endpoint, editedGateway)
        .then((res) => {
          //add element to local gateways and update stored gateways status
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

  //handle delete gateway
  function handleDelete(gateway: Gateway) {
    custom_axios
      .delete(endpoint + "/" + gateway._id) //delete request to api
      .then((res) => {
        let index = data.findIndex((el) => {
          return el._id === res.data._id;
        }); //find deleted gateway in local stored list
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
      {!data?.length && (
        <div
          style={{
            fontSize: "small",
            textAlign: "center",
            margin: "10% 10px",
            width: "100%",
          }}
        >
          No gateways
        </div>
      )}
      {data.map((gateway) => (
        <GatewayCard
          gateway={gateway}
          key={gateway._id}
          onEdit={(gateway) => {
            setEditedGateway(gateway);
            setEditing(true);
          }}
          onDelete={(gateway) => {
            handleDelete(gateway);
          }}
        />
      ))}
      <Tooltip title="Create...">
        <StyledCard
          onClick={() => {
            setEditedGateway({} as Gateway);
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
      <GatewayEditDialog
        open={editing}
        gateway={editedGateway}
        onValueChange={setEditedGateway}
        onCancel={() => setEditing(false)}
        onAccept={handleAccept}
      />
    </Container>
  );
}
