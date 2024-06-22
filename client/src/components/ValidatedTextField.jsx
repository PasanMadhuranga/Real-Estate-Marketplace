import { useState } from "react";
import TextField from "@mui/material/TextField";

export default function ValidatedTextField({
  label,
  validator,
  onChangeFunc,
  sxProps,
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const handleChange = (e) => {
    const newValue = e.target.value;
    const errorMessage = validator(newValue);
    setValue(newValue);
    setError(errorMessage);
    onChangeFunc(!errorMessage, newValue);
  };
  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      error={!!error}
      helperText={error}
      variant="outlined"
      fullWidth
      sx={sxProps}
      color="success"
    />
  );
}
