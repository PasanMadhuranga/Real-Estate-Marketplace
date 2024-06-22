import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { blueGrey } from "@mui/material/colors";
import { keyframes } from "@mui/system";
import theme from "../themes/theme";
import { useInView } from 'react-intersection-observer';
import FeaturesSection from "../components/FeaturesSection";


const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideInUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;


export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  const fetchOfferListings = async () => {
    try {
      const response = await axios.get("/api/listing/get?offer=true&limit=4");
      setOfferListings(response.data);
    } catch (error) {
      // console.error(error);
    }
  };

  const fetchSaleListings = async () => {
    try {
      const response = await axios.get("/api/listing/get?type=sale&limit=4");
      setSaleListings(response.data);
    } catch (error) {
      // console.error(error);
    }
  };

  const fetchRentListings = async () => {
    try {
      const response = await axios.get("/api/listing/get?type=rent&limit=4");
      setRentListings(response.data);
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    fetchOfferListings();
    fetchSaleListings();
    fetchRentListings();
  }, []);

  const [refOffers, inViewOffers] = useInView({ triggerOnce: true });
  const [refSales, inViewSales] = useInView({ triggerOnce: true });
  const [refRents, inViewRents] = useInView({ triggerOnce: true });

  return (
    <ThemeProvider theme={theme}>
      {/* Hero Section */}
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          backgroundImage: 'url(https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backgroundBlendMode: 'darken',
          animation: `${fadeIn} 2s ease-in-out`,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            animation: `${fadeIn} 2s ease-in-out, ${slideInUp} 2s ease-in-out`,
          }}
        >
          Find Your Perfect Place
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            marginTop: "16px",
            animation: `${fadeIn} 2.5s ease-in-out, ${slideInUp} 2.5s ease-in-out`,
          }}
        >
          Discover your dream home with us
        </Typography>
        <Button
          variant="contained"
          color="success"
          sx={{
            mt: 3,
            width: "200px",
            animation: `${fadeIn} 3s ease-in-out, ${slideInUp} 3s ease-in-out`,
          }}
          href="/search"
          size="large"
        >
          Get Started
        </Button>
      </Box>

      {/* Recent Offers Section */}
      <Box
        ref={refOffers}
        sx={{
          py: 4,
          px: 5,
          backgroundColor: blueGrey[50],
          animation: inViewOffers ? `${fadeInUp} 1s ease-in-out` : 'none',
          opacity: inViewOffers ? 1 : 0,
          transform: inViewOffers ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
       <FeaturesSection title="Recent Offers" listings={offerListings} href="/search?type=offer&limit=4" />
      </Box>

      {/* Recent Sales Section */}
      <Box
        ref={refSales}
        sx={{
          py: 4,
          px: 5,
          // backgroundColor: blueGrey[50],
          animation: inViewSales ? `${fadeInUp} 1s ease-in-out` : 'none',
          opacity: inViewSales ? 1 : 0,
          transform: inViewSales ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        <FeaturesSection title="Recent Sales" listings={saleListings} href="/search?type=sale&limit=4" />
      </Box>

      {/* Recent Rents Section */}
      <Box
        ref={refRents}
        sx={{
          py: 4,
          px: 5,
          backgroundColor: blueGrey[50],
          animation: inViewRents ? `${fadeInUp} 1s ease-in-out` : 'none',
          opacity: inViewRents ? 1 : 0,
          transform: inViewRents ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        <FeaturesSection title="Recent Rents" listings={rentListings} href="/search?type=rent&limit=4" />
      </Box>

      {/* About Us Section */}
      <Box sx={{ py: 4, px: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" component="h2" color={blueGrey[800]} gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" color={blueGrey[700]} sx={{ mb: 2 }}>
          We are committed to providing the best real estate services. Our team is dedicated to helping you find the perfect home, making the process easy and enjoyable.
        </Typography>
        <Button variant="outlined" color="success" href="/about">
          Learn More
        </Button>
      </Box>
    </ThemeProvider>
  );
}
