import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import { Oval } from "react-loader-spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from 'swiper/modules';
import "./Listing.css";

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { listingId } = useParams();

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
        <Swiper navigation={true} modules={[Navigation]}>
        {listing.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
            <img
              className="listing-image"
              src={url}
              alt={listing.name}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      )}
    </>
  );
}
