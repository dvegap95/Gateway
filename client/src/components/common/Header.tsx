import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledToolbar = styled(Toolbar)`
  justify-content: center;
  height: 50px;
  overflow: hidden;//hide click effect overflows on extremely small screens
`;
const StyledLink = styled(Link)`
  justify-content: center;
  color: white;
  height: 50px;
  padding: 0 10px;
  align-items: center;
  display: flex;
  text-decoration: none;
`;

export default function Header() {
  return (
    <AppBar position="fixed">
      <StyledToolbar variant="dense">
        <StyledLink to="/">Home</StyledLink> 
        <StyledLink to="/gateways">Gateways</StyledLink> 
        <StyledLink to="/peripheral-devices">Peripheral Devices</StyledLink>
      </StyledToolbar>
    </AppBar>
  );
}
