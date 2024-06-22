import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import ImageSlider from "../components/ImageSlider";
import { Box, Typography, Button, Chip, Divider, Alert,Grid } from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";
import { useNavigate } from "react-router-dom";

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contact, setContact] = useState(false);
  const { listingId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
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

  const handleDeleteListing = async () => {
    try {
      await axios.delete(`/api/listing/delete/${listingId}`);;
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  }

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
          <ImageSlider imageUrls={listing.imageUrls} />
          <Box
            sx={{
              width: "100%",
              maxWidth: "lg",
              p: 3,
              m: "auto",
              mt: 3,
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              {listing.name} - {listing.regularPrice.toLocaleString()} $
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
              {listing.offer && (
              <Chip
                label={`$${listing.regularPrice - listing.discountPrice} discount`}
                color="success"
              />
            )}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" gutterBottom>
              {listing.description}
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{mt: 2}}
            >
            <Grid container>
              <Grid item xs={6} sm={3} sx={{mb:3}}>
                <Box display="flex" alignItems="center" justifyContent="start">
                  <BedIcon color="secondary" />
                  <Typography variant="body2" ml={1}>
                    {listing.bedrooms} Beds
                  </Typography>
                </Box>
              </Grid> 

              <Grid item xs={6} sm={3} sx={{ mb:3 }}>
                <Box display="flex" alignItems="center" justifyContent="start">
                  <BathtubIcon color="secondary" />
                  <Typography variant="body2" ml={1}>
                    {listing.bathrooms} Baths
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={3} sx={{ mb:3 }}>
                <Box display="flex" alignItems="center" justifyContent="start">
                  <DirectionsCarIcon
                    color={listing.parking ? "secondary" : "disabled"}
                  />
                  
                  <Typography variant="body2" ml={1}>
                    {listing.parking ? "Parking" : "No Parking"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Box display="flex" alignItems="center" justifyContent="start">
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
                </Grid>
              </Grid>
            </Box>
            {currentUser && (currentUser._id !== listing.userRef ? (contact ? (
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
            )): <>
            <Button variant="contained" size="small" color="info" href={`/edit-listing/${listing._id}`}>Edit</Button>
            <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleDeleteListing}
            sx={{ml:3}}
          >
            Delete
          </Button>
            </>)}
          </Box>
        </>
      )}
    </>
  );
}
