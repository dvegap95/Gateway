import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import styled from "styled-components";


export default function Loading(props:{open:boolean,others?:any}) {
  return (
    <Backdrop {...props} appear in>
      <CircularProgress style={{color:"white"}}/>
    </Backdrop>
  );
}
