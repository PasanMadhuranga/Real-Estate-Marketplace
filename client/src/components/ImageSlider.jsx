import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "./ImageSlider.css";
import { Box } from "@mui/material";

export default function ImageSlider({ imageUrls }) {
  return (
    <Box sx={{ width: "100%", height: "500px" }}>
      <Swiper
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: true }}
        loop={true}
        effect="fade"
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
      >
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <img className="listing-image" src={url} alt={`Slide ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
