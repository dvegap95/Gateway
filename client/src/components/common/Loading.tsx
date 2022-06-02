import React from "react";
import Backdrop,{BackdropProps} from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"

import styled from "styled-components";

export default function Loading(props: BackdropProps | { open: boolean }) {
  return (
    <Backdrop {...props} appear in>
      <CircularProgress style={{ color: "white" }} />
    </Backdrop>
  );
}
