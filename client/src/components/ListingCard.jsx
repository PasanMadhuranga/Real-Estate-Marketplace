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

export default function ListingCard({ id, handleDeleteListing, imgUrl, name }) {
  // const navigate = useNavigate();

  // const handleEdit = () => {
  //   navigate(`/edit-listing/${id}`);
  // };
  // console.log("key", id)
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
          alignItems: "center",
          textDecoration: "none",
        }}
        href={`/listing/${id}`}
      >
        <Box
          component="img"
          sx={{ width: "150px", height: "100px", objectFit: "cover" }}
          src={imgUrl}
        ></Box>
        <CardContent
          sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}
        >
          <Link href={`/listing/${id}`} underline="none">
            <Typography
              sx={{
                fontSize: 16,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                WebkitLineClamp: 1,
              }}
              color="text.main"
            >
              {name}
            </Typography>
          </Link>
        </CardContent>
        {/* <Box sx={{ display: "flex", justifyContent: "flex-end"}}> */}
        <CardActions sx={{ pr: 2 }}>
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
