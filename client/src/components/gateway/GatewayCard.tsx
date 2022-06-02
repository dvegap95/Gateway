import React, { useState } from "react";
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import IconButton from "@mui/material/IconButton"
import Chip from "@mui/material/Chip"
import styled from "styled-components";
import Edit from "@mui/icons-material/Edit";
import { Gateway, PeripheralDevice } from "../../entities/entities";
import { Circle, Delete } from "@mui/icons-material";
import ConfirmDialog from "../common/ConfirmDialog";

export const StyledCard = styled(Card)`
  margin: 10px;
  width: 350px;
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
  min-height: 100px;
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
`;

const StyledDot = styled(Circle)`
  max-height: 12px;
  max-width: 12px;
  margin: 5px;
  color: ${(props: { status: any }) =>
    props.status === "online" ? "#07BC12" : "gray"}!important;
  pointer-events: none;
`;

const StyledChip = styled(Chip)`
  margin: 3px !important;
  min-width: 90px;
`;

//controlled component for display gateway information as a card.
export default function GatewayCard(props: {
  gateway: Gateway;
  onEdit?: (gateway: Gateway) => void; //callback for edit button pressed
  onDelete?: (gateway: Gateway) => void; //callback for delete button pressed
}) {
  const { gateway } = props;
  const [deleteConfirm, setDeleteConfirm] = useState(false); //controls when confirm dialog is open
  return (
    <StyledCard>
      <StyledCardTitle>
        <div>{gateway.name || "Unknown"}</div>
        {gateway.ipAddress && (
          <div style={{ color: "#888" }}>{gateway.ipAddress}</div>
        )}
      </StyledCardTitle>
      <StyledCardContent>
        {gateway.devices.map((dev) => (
          <StyledChip
            label={dev.uid + " - " + dev.vendor || "unknown"}
            variant="outlined"
            size="small"
            deleteIcon={<StyledDot status={dev.status}/>}
            onDelete={() => {}}
            key={dev._id}
          />
        ))}
      </StyledCardContent>
      <StyledCardActions>
        <div>serial: {gateway.serialNumber || "no serial number"}</div>
        <div>
          <IconButton
            disabled={!props.onEdit}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              return props.onEdit && props.onEdit(gateway);
            }}
            data-testid="edit_btn"
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
            data-testid="delete_btn"
          >
            <Delete></Delete>
          </IconButton>
        </div>
      </StyledCardActions>
      <ConfirmDialog
        title="Confirm delete item?"
        onConfirm={() => {
          //if confirm dialog is accepted notify to the parent component the item to be deleted
          props.onDelete && props.onDelete(gateway);
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
