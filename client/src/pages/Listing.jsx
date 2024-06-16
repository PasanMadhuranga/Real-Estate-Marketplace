import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import "./Listing.css";
import { Box, Typography, Button, Chip, Divider, Alert } from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contact, setContact] = useState(false);
  const { listingId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/listing/get/${listingId}`);
        if (response.success === false) {
          setLoading(false);
          setError(response.message);
        }
        setLoading(false);
        setListing(response.data);
        setError(null);
      } catch (error) {
        setLoading(false);
        setError(error.response.data.message);
      }
    };
    fetchListing();
  }, [listingId]);
  return (
    <>
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Oval
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      {listing && !loading && !error && (
        <>
          <Swiper navigation={true} modules={[Navigation]}>
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <img className="listing-image" src={url} alt={listing.name} />
              </SwiperSlide>
            ))}
          </Swiper>
          <Box
            sx={{
              width: "100%",
              maxWidth: "lg",
              p: 3,
              m: "auto",
              mt: 5,
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              {listing.name} - {listing.regularPrice} $
              {listing.type === "rent" && "/Month"}
            </Typography>

            <Typography variant="body2" color="textSecondary">
              <LocationOnIcon color="success" />
              {listing.address}
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Chip
                label={`For ${listing.type === "sell" ? "Sale" : "Rent"}`}
                color="error"
              />
              <Chip
                label={`$${listing.discountPrice} discount`}
                color="success"
              />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" gutterBottom>
              {listing.description}
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{mt: 2, mb: 3}}
            >
              <Box display="flex" alignItems="center">
                <BedIcon color="secondary" />
                <Typography variant="body2" ml={1}>
                  {listing.bedrooms} Beds
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <BathtubIcon color="secondary" />
                <Typography variant="body2" ml={1}>
                  {listing.bathrooms} Baths
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <DirectionsCarIcon
                  color={listing.parking ? "secondary" : "disabled"}
                />
                <Typography variant="body2" ml={1}>
                  {listing.parking ? "Parking" : "No Parking"}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                {listing.furnished ? (
                  <>
                    <CheckIcon color="success" />
                    <Typography variant="body2" ml={1}>
                      Furnished
                    </Typography>
                  </>
                ) : (
                  <>
                    <CloseIcon color="error" />
                    <Typography variant="body2" ml={1}>
                      Not Furnished
                    </Typography>
                  </>
                )}
                {/* <CheckIcon color="primary" /> */}
              </Box>
            </Box>
            {currentUser && currentUser._id !== listing.userRef && contact ? (
              <Contact listing={listing} />
            ) : (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => setContact(true)}
              >
                contact landlord
              </Button>
            )}
          </Box>
        </>
      )}
    </>
  );
}
