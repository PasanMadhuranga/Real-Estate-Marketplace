import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardMedia,
  Box,
  Link,
} from "@mui/material";
import theme from "../themes/theme";
import { ThemeProvider } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";

export default function ListingCard({ id,handleDeleteListing, imgUrl, name }) {
  // const navigate = useNavigate();

  // const handleEdit = () => {
  //   navigate(`/edit-listing/${id}`);
  // };
  // console.log("key", id)
  return (
    <ThemeProvider theme={theme}>
      <Card
        component={Link}
        variant="filled"
        sx={{
          minWidth: 275,
          mb: 2,
          display: "flex",
          bgcolor: "nature.dark",
          boxShadow: 4,
          alignItems: "center",
          textDecoration: 'none'
        }}
        href={`/listing/${id}`}
      >
        <Box sx={{ width: "150px", height: "100px"}}>
          <CardMedia
            component="img"
            sx={{ height: 100, objectFit: "cover" }}
            image={imgUrl}
            alt={name}
          />
        </Box>
        <CardContent sx={{ display: "flex", alignItems: "center", flexGrow: 1  }}>
          <Typography sx={{ fontSize: 16 }} color="text.main">
            {name.length > 23 ? name.slice(0, 22) + "..." : name}
          </Typography>
        </CardContent>
        {/* <Box sx={{ display: "flex", justifyContent: "flex-end"}}> */}
          <CardActions sx={{pr: 2}}>
            <Button 
              variant="contained" 
              size="small"
              type="text"
              href={`/edit-listing/${id}`}
              // onClick={handleEdit}
            >
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
        {/* </Box> */}
      </Card>
    </ThemeProvider>
  );
}
