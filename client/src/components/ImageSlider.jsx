import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import "./ImageSlider.css";

export default function ImageSlider({ imageUrls }) {
  return (
    <Swiper navigation={true} modules={[Navigation]}>
      {imageUrls.map((url, index) => (
        <SwiperSlide key={index}>
          <img className="listing-image" src={url} alt="image" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
