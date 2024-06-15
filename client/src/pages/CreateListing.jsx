import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import QuantityInput from "../components/QuantityInput";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function CreateListing() {
  return (
    // using main this makes SEO friendly
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h3">
          Create a Listing
        </Typography>
        <Box component="form" sx={{ mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                label="Name"
                variant="filled"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                color="success"
                fullWidth
              >
                Upload images
                <VisuallyHiddenInput type="file" />
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="description"
                required
                fullWidth
                id="description"
                label="Description"
                autoFocus
                variant="filled"
                inputProps={{ maxLength: 100, minLength: 3 }}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="address"
                required
                fullWidth
                id="address"
                label="Address"
                autoFocus
                variant="filled"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <FormGroup row={true} sx={{ justifyContent: "space-between" }}>
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Sell"
                />
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Rent"
                />
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Parking spot"
                />
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Furnished"
                />
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Offer"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <QuantityInput inputLabel="Beds" min={1} max={10} />
                </Grid>
                <Grid item xs={4}>
                  <QuantityInput inputLabel="Bathrooms" min={1} max={10} />
                </Grid>
                <Grid item xs={4}>
                  <QuantityInput
                    inputLabel="Regular Price ($/ Month)"
                    min={1}
                    max={10000}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            size="large"
            // disabled={loading}
          >
            {/* {loading ? "Loading..." : "CREATE LISTING"} */}
            CREATE LISTING
          </Button>
        </Box>
        {/* {error && (
          <Alert sx={{ mt: 2 }} severity="error">
            {error}
          </Alert>
        )} */}
      </Box>
    </Container>
  );
}
