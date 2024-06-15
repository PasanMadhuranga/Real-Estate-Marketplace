import React from "react";
import { TextField, Box } from "@mui/material";

function QuantityInput({ inputLabel, min, max, fieldName }) {
  return (
    <Box
      // component="form"
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
      />
    </Box>
  );
}

export default QuantityInput;
