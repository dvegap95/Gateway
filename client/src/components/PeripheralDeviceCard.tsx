import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
} from "@mui/material";
import React from "react";
import styled from "styled-components";
import Circle from "@mui/icons-material/Circle";
import Edit from "@mui/icons-material/Edit";
import { PeripheralDevice } from "../entities/entities";

const StyledCard = styled(Card)`
  margin: 10px;
  min-width: 240px;
  max-width: 380px;
  &:hover {
    background: #eee;
  }
  &:active {
    background: #bbb;
  }
`;
const StyledCardContent = styled.div`
  color: #666;
  padding: 10px;
  padding-top: 2px;
  margin: 0;
`;
const StyledCardActions = styled(CardActions)`
  font-size: small;
  color: #777;
  text-align: end;
  justify-content: space-between;
`;
const StyledCardTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  align-items: center;
  padding: 10px;
  padding-bottom: 2px;
`;

const StatusDot = styled(Circle)`
  max-height: 12px;
  max-width: 12px;
  margin: 5px;
  color: ${(props: { status: any }) =>
    props.status === "online" ? "#4bb543" : "gray"};
`;

export default function PeripheralDeviceCard(props: {
  device: PeripheralDevice;
  onEdit?: Function;
}) {
  const { device } = props;
  return (
    <StyledCard>
      <StyledCardTitle>
        <div>{device.uid || "Unknown UID"}</div>
        <Tooltip title={`status: ${device.status}`}>
          <StatusDot status={device.status} />
        </Tooltip>
      </StyledCardTitle>
      <StyledCardContent>
        {device.vendor && <div>vendor: {device.vendor}</div>}
      </StyledCardContent>
      <StyledCardActions>
        <div>Created at {new Date(device.created).toLocaleString()}</div>
        <IconButton
          disabled={!props.onEdit}
          size="small"
          onClick={() => props.onEdit && props.onEdit(device)}
        >
          <Edit></Edit>
        </IconButton>
      </StyledCardActions>
    </StyledCard>
  );
}
