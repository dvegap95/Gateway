import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const StyledSelectEdit = styled(Select)`
  min-width: 200px;
`;

export default function CrudSelectEdit(props: {
  value: string;
  element: any;
  label?: string;
  onChange: (element: any) => void;
  items: Array<any>;
  default?: any;
  fullWidth?: boolean;
}) {
  return (
    <FormControl fullWidth={props.fullWidth}>
      <InputLabel id="crud-select-label">
        {props.label || props.value}
      </InputLabel>
      <StyledSelectEdit
        labelId="crud-select-label"
        label={props.label || props.value}
        value={props.element[props.value] || props.default}
        onChange={(event) => {
          let value: any = event.target?.value;
          let obj: any = {};
          obj[props.value] = value;
          props.onChange({ ...props.element, ...obj });
        }}
      >
        {props.items &&
          props.items.map((item: string) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
      </StyledSelectEdit>
    </FormControl>
  );
}
