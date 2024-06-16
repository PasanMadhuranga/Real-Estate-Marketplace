import React from "react";
import { TextField, Box } from "@mui/material";

function QuantityInput({ inputLabel, min, max, fieldName, value, onChangeFunc }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mt: 3,
        ml: 0,
      }}
    >
      <TextField
        type="number"
        label={inputLabel}
        variant="outlined"
        fullWidth
        InputProps={{ inputProps: { min, max } }}
        name={fieldName}
        id={fieldName}
        value={value}
        onChange={onChangeFunc}
      />
    </Box>
  );
}

export default QuantityInput;
