import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Link,
} from "@mui/material";
import theme from "../themes/theme";
import { ThemeProvider } from "@mui/material/styles";
import WarningDialog from "./WarningDialog";
import { useState } from "react";

export default function ListingCard({ id, handleDeleteListing, imgUrl, name }) {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <Card
        variant="filled"
        sx={{
          minWidth: 275,
          mb: 2,
          display: "flex",
          bgcolor: "nature.dark",
          boxShadow: 2,
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
        <CardActions sx={{ pr: 2 }}>
          <Button
            variant="contained"
            size="small"
            href={`/edit-listing/${id}`}
            // onClick={handleEdit}
          >
            edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => setOpenDialog(true)}
          >
            Delete
          </Button>
          <WarningDialog
            open={openDialog}
            handleClose={() => setOpenDialog(false)}
            title={"Are you sure you want to delete this listing?"}
            subtitle={
              "All the listing data will be lost and you won't be able to recover it."
            }
            deleteBtnText="Delete"
            handleDelete={() => handleDeleteListing(id)}
          />
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}
