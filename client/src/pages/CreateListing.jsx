import React from 'react'
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

export default function CreateListing() {
  return (
    // using main this makes SEO friendly
    <Box component="main" maxWidth="xs" >
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" >
          Create a Listing
        </Typography>
        <Box component="form"  sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                variant="filled"
                
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField 
                name="description"
                required
                fullWidth
                id="description"
                label="Description"
                autoFocus
                variant="filled"
                inputProps={{ maxLength: 50, minLength: 3 }}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                name="address"
                required
                fullWidth
                id="address"
                label="Address"
                autoFocus
                variant="filled"
                
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
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
    </Box>
  )
}

