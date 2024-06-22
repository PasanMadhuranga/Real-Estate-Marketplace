import { useState } from "react";
import TextField from "@mui/material/TextField";

export default function ValidatedTextField({
  label,
  validator,
  onChangeFunc,
  sxProps = {},
  type = "text",
  multiline = false,
  rows = 1,
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const handleChange = (e) => {
    const newValue = e.target.value;
    const errorMessage = validator(newValue);
    setValue(newValue);
    setError(errorMessage);
    onChangeFunc(!errorMessage, newValue); // pass isValid and value to parent component
  };
  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      error={!!error} // convert error to boolean
      helperText={error} // display error message
      variant="outlined"
      fullWidth
      sx={sxProps}
      color="success"
      type={type}
      multiline={multiline}
      rows={rows}
    />
  );
}
