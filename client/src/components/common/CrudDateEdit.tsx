import * as React from "react";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import styled from "styled-components";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const StyledDateEdit = styled(DateTimePicker)`
  width: 100%;
`;
//mui date time picker adapted to work as a controlled component over a property of an object
export default function CrudDateEdit(props: {
  propertyName: string; //name of the target property in the object
  element: any; //object containing the target property
  onChange: (element: any) => void; //change callback (passes the entire object, not only the property)
  fullWidth: boolean;
  label: string; //input label
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledDateEdit
        renderInput={(props) => (
          <TextField {...props} fullWidth={props.fullWidth} />
        )}
        label={props.label || props.propertyName}
        value={props.element[props.propertyName] || null} //allow date to be unspecified
        onChange={(value) => {
          let obj: any = { ...props.element }; //copy the props element
          obj[props.propertyName] =
            value instanceof Date ? value.toISOString() : ""; //update target property
          props.onChange(obj); // notify change to parent
        }}
      />
    </LocalizationProvider>
  );
}
