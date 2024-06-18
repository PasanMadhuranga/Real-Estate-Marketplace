import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ImageSlider from "../components/ImageSlider";
import theme from "../themes/theme";
import { ThemeProvider } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { Grid } from "@mui/material";
import PropertyCard from "../components/PropertyCard";
import { blueGrey } from "@mui/material/colors";

const imageUrls = [
  "https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1628133287836-40bd5453bed1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1489370321024-e0410ad08da4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1560448076-213180fe7d44?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  
  const fetchOfferListings = async () => {
    try {
      const response = await axios.get("/api/listing/get?offer=true&limit=4");
      setOfferListings(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSaleListings = async () => {
    try {
      const response = await axios.get("/api/listing/get?type=sell&limit=4");
      setSaleListings(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRentListings = async () => {
    try {
      const response = await axios.get("/api/listing/get?type=rent&limit=4");
      setRentListings(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOfferListings();
    fetchSaleListings();
    fetchRentListings();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: "400px",
          width: "100%",
          // backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(https://images.unsplash.com/photo-1486607303850-bc051a4ffad4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODJ8fHJlYWwlMjBlc3RhdGV8ZW58MHwwfDB8fHww)', // Add your background image path here
          // backgroundSize: 'cover',
          // backgroundPosition: 'center',
          display: "flex",
          flexDirection: "column",
          // alignItems: 'center',
          justifyContent: "center",
          // color: 'white',
          // textAlign: 'center',
          bgcolor: "nature.dark",
          p: 6,
        }}
      >
        <Typography variant="h3" component="h1" >
          Find your next perfect place with ease
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{ marginTop: "16px" }}
        >
          We will help you find your home fast, easy and comfortable. Our expert
          support are always available.
        </Typography>
        <Button
          variant="contained"
          color="success"
          sx={{ mt: 3, width: "200px" }}
          href="/search"
        >
          Let’s Start now
        </Button>
      </Box>
      <ImageSlider imageUrls={imageUrls} />
      <Box sx={{ my: 4, mx: 5 }}>
        <Typography variant="h5" component="h4" gutterBottom color={blueGrey[600]}>
          Recent Offers
        </Typography>
        <Button variant="text" color="success" href="/search?offer=true" sx={{mb: 1}}>
          View All
        </Button>
        <Grid container spacing={3}>
          {offerListings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} xl={3} key={listing._id}>
              <PropertyCard listing={listing} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ my: 4, mx: 5 }}>
        <Typography variant="h5" component="h4" gutterBottom color={blueGrey[600]}>
          Recent places for Sale
        </Typography>
        <Button variant="text" color="success" href="/search?type=sell" sx={{mb: 1}}>
          View All
        </Button>
        <Grid container spacing={3}>
          {saleListings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} xl={3} key={listing._id}>
              <PropertyCard listing={listing} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ my: 4, mx: 5 }}>
        <Typography variant="h5" component="h4" gutterBottom color={blueGrey[600]}>
          Recent places for Rent
        </Typography>
        <Button variant="text" color="success" href="/search?type=rent" sx={{mb: 1}}>
          View All
        </Button>
        <Grid container spacing={3}>
          {rentListings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} xl={3} key={listing._id}>
              <PropertyCard listing={listing} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
