import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardMedia,
  Box,
} from "@mui/material";
import theme from "../themes/theme";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";



export default function ProfileListing({ handleDelete, imgUrl, name }) {

  return (
    <ThemeProvider theme={theme}>
      <Card
        variant="filled"
        sx={{
          minWidth: 275,
          mb: 2,
          display: "flex",
          bgcolor: "nature.dark",
          boxShadow: 4,
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={imgUrl}
          alt={name}
        />
        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 16 }} color="text.main">
            {name}
          </Typography>
        </CardContent>
        <Box sx={{width: 1, display: "flex", justifyContent: "flex-end"}}>
          <CardActions sx={{ display: "flex" }}>
            <Button variant="contained" size="small">
              edit
            </Button>
            <Button variant="contained" color="error" size="small" onClick={handleDelete}>
              Delete
            </Button>
          </CardActions>
        </Box>
      </Card>
    </ThemeProvider>
  );
}
