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

export default function GatewayView() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(new Array<Gateway>());
  const [editedGateway, setEditedGateway] = useState({} as Gateway);
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
    if (editedGateway._id) {
      custom_axios
        .patch(endpoint + "/" + editedGateway._id, editedGateway)
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
        .post(endpoint, editedGateway)
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

  function handleDelete(gateway: Gateway) {
    custom_axios
      .delete(endpoint + "/" + gateway._id)
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
