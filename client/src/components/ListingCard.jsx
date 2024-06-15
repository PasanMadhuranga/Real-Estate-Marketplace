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

export default function ListingCard({ handleDeleteListing, imgUrl, name }) {
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
        <Box sx={{ width: "200px", height: "100px"}}>
          <CardMedia
            component="img"
            sx={{ height: 100, objectFit: "cover" }}
            image={imgUrl}
            alt={name}
          />
        </Box>
        <CardContent sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ fontSize: 16 }} color="text.main">
            {name}
          </Typography>
        </CardContent>
        <Box sx={{ width: 1, display: "flex", justifyContent: "flex-end" }}>
          <CardActions>
            <Button variant="contained" size="small">
              edit
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleDeleteListing}
            >
              Delete
            </Button>
          </CardActions>
        </Box>
      </Card>
    </ThemeProvider>
  );
}
