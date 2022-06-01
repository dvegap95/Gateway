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

//mui selector adapted to work as a controlled component over a property of an object
export default function CrudSelectEdit(props: {
  propName: string; //name of the target property in the object
  element: any; //object containing the target property
  label?: string;
  onChange: (element: any) => void; //change callback (passes the entire object, not only the property)
  items: Array<any>; //list of items to be rendered as selection options
  default?: any; //selected when no target property's value is provided
  fullWidth?: boolean;
}) {
  return (
    <FormControl fullWidth={props.fullWidth}>
      <InputLabel id="crud-select-label">
        {props.label || props.propName}
      </InputLabel>
      <StyledSelectEdit
        //renders provided InputLabel component with the proper behavior (animations and stuff)
        labelId="crud-select-label"
        label={props.label || props.propName}
        value={props.element[props.propName] || props.default}
        onChange={(event) => {
          let value: any = event.target?.value;
          let obj: any = { ...props.element }; //copy the props element
          obj[props.propName] = value; //update target property
          props.onChange(obj); // notify change to parent
        }}
      >
        {props.items &&
          props.items.map((item: string) => (//render the items as menu items
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
      </StyledSelectEdit>
    </FormControl>
  );
}
