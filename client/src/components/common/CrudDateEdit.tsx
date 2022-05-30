import * as React from "react";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import styled from "styled-components";

const StyledDateEdit = styled(DateTimePicker)`
  width: 100%;
`;
export default function CrudDateEdit(props: {
  value: string;
  element: any;
  onChange: (element: any) => void;
  fullWidth: boolean;
  label: string;
}) {
  return (
    <StyledDateEdit
      renderInput={(props) => <TextField {...props} fullWidth />}
      label={props.label || props.value}
      value={props.element[props.value] || null}
      onChange={(value) => {
        let obj: any = {};
        obj[props.value] = value instanceof Date ? value.toISOString() : "";
        props.onChange({ ...props.element, ...obj });
      }}
    />
  );
}
