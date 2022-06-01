import React, { useState } from "react";
import { Card, CardActions, IconButton, Tooltip } from "@mui/material";
import styled from "styled-components";
import Circle from "@mui/icons-material/Circle";
import Edit from "@mui/icons-material/Edit";
import { PeripheralDevice } from "../../entities/entities";
import { Delete } from "@mui/icons-material";
import ConfirmDialog from "../common/ConfirmDialog";

export const StyledCard = styled(Card)`
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
export const StyledCardContent = styled.div`
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
  color: ${(props: { status: any }) => {
    console.log("status evaluated");
    return props.status === "online" ? "#07BC12" : "gray";
  }};
`;

//controlled component for display peripheral device information as a card.
export default function PeripheralDeviceCard(props: {
  device: PeripheralDevice;
  onEdit?: (device: PeripheralDevice) => void; //callback for edit button pressed
  onDelete?: (device: PeripheralDevice) => void; //callback for delete button pressed
}) {
  const { device } = props;
  const [deleteConfirm, setDeleteConfirm] = useState(false); //controls when confirm dialog is open
  return (
    <StyledCard>
      <StyledCardTitle>
        <div>{device.uid || "Unknown UID"}</div>
        <Tooltip title={`status: ${device.status}`}>
          <StatusDot
            status={device.status} // dot indicating status (green for online and gray otherwise)
          />
        </Tooltip>
      </StyledCardTitle>
      <StyledCardContent>
        {device.vendor && <div>vendor: {device.vendor}</div>}
      </StyledCardContent>
      <StyledCardActions>
        <div>Created at {new Date(device.created).toLocaleString()}</div>
        <div>
          <IconButton
            disabled={!props.onEdit}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              return props.onEdit && props.onEdit(device);
            }}
          >
            <Edit></Edit>
          </IconButton>
          <IconButton
            disabled={!props.onEdit}
            size="small"
            onClick={(e) => {
              e.stopPropagation;
              setDeleteConfirm(true); //opens confirm dialog before deleting
            }}
          >
            <Delete></Delete>
          </IconButton>
        </div>
      </StyledCardActions>
      <ConfirmDialog
        title="Confirm delete item?"
        onConfirm={() => {
          //if confirm dialog is accepted notify to the parent component the item to be deleted
          props.onDelete && props.onDelete(device);
          setDeleteConfirm(false); //close the dialog
        }}
        onCancel={() => {
          setDeleteConfirm(false); //close the dialog
        }}
        open={deleteConfirm}
      />
    </StyledCard>
  );
}