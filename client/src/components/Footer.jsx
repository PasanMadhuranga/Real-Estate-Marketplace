import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

export default function Footer() {
  return (
    <Box
      sx={{
        py: 4,
        px: 5,
        backgroundColor: blueGrey[800],
        color: "white",
        textAlign: "center",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
      }}
    >
      <Typography variant="h5" component="h3" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Have any questions? Reach out to our support team, and we'll be happy to
        help.
      </Typography>
      <Button variant="contained" color="success" href="/contact">
        Get in Touch
      </Button>
    </Box>
  );
}
