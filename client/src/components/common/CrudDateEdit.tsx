import * as React from "react";
import TextField,{TextFieldProps} from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import styled from "styled-components";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const StyledDateEdit = styled(DateTimePicker)`
  width: 100%;
`;
//mui date time picker adapted to work as a controlled component over a property of an object
export default function CrudDateEdit(
  props: TextFieldProps & {
    propname: string; //name of the target property in the object
    element: any; //object containing the target property
    onValueChange: (element: any) => void; //change callback (passes the entire object, not only the property)
    label: string; //input label
  }
) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} >
      <StyledDateEdit
        renderInput={(params) => <TextField {...params} {...props} />}
        label={props.label || props.propname}
        value={props.element[props.propname] || null} //allow date to be unspecified
        onChange={(value) => {
          let obj: any = { ...props.element }; //copy the props element
          obj[props.propname] =
            value instanceof Date ? value.toISOString() : ""; //update target property
          props.onValueChange(obj); // notify change to parent
        }}
      />
    </LocalizationProvider>
  );
}
