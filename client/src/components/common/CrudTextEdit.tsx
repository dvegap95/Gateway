import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

var timeoutHandler = -1;
export default function CrudTextEdit(props: {
  value: string;
  element: any;
  label?: string;
  cantBeWrong?: boolean;
  rules?: Array<(value: string) => boolean | string>;
  onErrorChange?: (error: boolean | string) => void;
  onChange: (element: any) => void;
  fullWidth?: boolean;
  transform?: Function;
}) {
  const [error, setError] = useState(false as boolean | string);

  useEffect(() => {
    props.onErrorChange && props.onErrorChange(error);
    clearTimeout(timeoutHandler);
    timeoutHandler = -1;
    if (props.cantBeWrong) {
      timeoutHandler = setTimeout(handleChange,1000);
    }
  }, [error]);

  const handleChange = (value: any = props.element[props.value]) => {
    console.log({ value });
    if (value && props.rules && props.rules.length) {
      let i = 0;
      for (; i < props.rules.length; i++) {
        let result = props.rules[i](value);
        if (result !== true) {
          let err = result === false ? true : result;
          console.log({ err });
          setError(err);
          if (props.cantBeWrong) return;
          break;
        }
      }
      if (i === props.rules.length) setError(false);
    }
    if (value === "") setError(false);
    let obj: any = {};
    obj[props.value] = props.transform ? props.transform(value) : value;
    let resultElement = { ...props.element, ...obj };
    if (!value) delete resultElement[props.value];
    props.onChange(resultElement);
  };
  return (
    <TextField
      fullWidth={props.fullWidth}
      label={props.label || props.value}
      value={props.element[props.value]}
      error={!!error}
      helperText={error || undefined}
      onChange={(event) => handleChange(event?.target?.value)}
      onBlur={() => {
        handleChange();
      }}
    />
  );
}
