import TextField,{ TextFieldProps } from "@mui/material/TextField";
import React, { useEffect, useState } from "react";

var timeoutHandler: any = -1;

//mui text field adapted to work as a controlled component over a property of an object
export default function CrudTextEdit(
  props: TextFieldProps & {
    propName: string; //name of the target property in the object
    element: any; //object containing the target property
    label?: string;
    //change callback (passes the entire object, not only the property)
    onValueChange: (element: any) => void;
    //set of validation callbacks receiving the input value and returning true for valid,
    //false for error with no message or a string for error message to be displayed
    rules?: Array<(value: string) => boolean | string>;
    //if true, input validation failure is prevented to be reflected in the actual input value
    cantBeWrong?: boolean;
    onErrorChange?: (error: boolean | string) => void; //error status callback for parent to be aware of validation process
    fullWidth?: boolean;
    transform?: Function; //applies a transformation to the target property before updating the object containing it
  }
) {
  const [error, setError] = useState(false as boolean | string);

  useEffect(() => {
    props.onErrorChange && props.onErrorChange(error); //if error callback exists in props, notify error change
    if (props.cantBeWrong) {
      //manage a timeout to reset the error status since when props.cantBeWrong is true,
      //no actual invalid inputs can exist, so it is revalidated a second after the user
      //tried to type the last wrong character
      clearTimeout(timeoutHandler); //clears the timeout for reset it every time the error status change
      //if there's still an error, timeout is set again to revalidate after 1 second
      if (error) timeoutHandler = setTimeout(handleChange, 1000);

      //TODO timeout is not being reset properly
    }
  }, [error]);

  //evaluates current input value by default
  const handleChange = (value: any = props.element[props.propName]) => {
    //are there validation rules and a value to validate?
    if (value && props.rules && props.rules.length) {
      let i = 0;
      //iterate through rules sequentially
      for (; i < props.rules.length; i++) {
        let result = props.rules[i](value); //evaluate the rule
        if (result !== true) {
          //did validation fail?
          let err = result === false ? true : result; //set error = message | false (empty error)
          setError(err); //react state update
          //if the value cant be wrong, nothing else happens so the changes aren't reflected
          //in the object containing the target property
          if (props.cantBeWrong) return;
          break; //otherwise break the for loop when validation failed for the first time
        }
      }
      if (i === props.rules.length) setError(false); // clear the error if for loop completed without problems
    }
    if (!value) setError(false); //if(!value) clear the error //TODO handle 'required' property for required values
    let obj: any = { ...props.element }; //copy the props element
    if (value)
      obj[props.propName] = props.transform
        ? props.transform(value)
        : value; //update target property
    else obj[props.propName] = null; //sets the value to null if it's falsy so the api can delete it
    props.onValueChange(obj); // notify change to parent
  };

  const value = props.element[props.propName];
  return (
    <TextField
      {...props}
      label={props.label || props.propName}
      value={value === null || value === undefined ? "" : value}
      error={!!error}
      helperText={error || undefined}
      onChange={(event) => handleChange(event?.target?.value)}
      onBlur={() => {
        //revalidate when focus looses to stablish the current state of the error
        //if props.cantBeWrong is true, all the validation errors should disappear
        handleChange();
      }}
    />
  );
}
