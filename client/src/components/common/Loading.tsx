import React from "react";
import { Backdrop, BackdropProps, CircularProgress } from "@mui/material";
import styled from "styled-components";

export default function Loading(props: BackdropProps | { open: boolean }) {
  return (
    <Backdrop {...props} appear in>
      <CircularProgress style={{ color: "white" }} />
    </Backdrop>
  );
}
