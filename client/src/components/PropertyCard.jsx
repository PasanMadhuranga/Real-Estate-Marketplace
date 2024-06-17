import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
// import BedIcon from "@mui/icons-material/Bed";
import HotelIcon from '@mui/icons-material/Hotel';
import BathtubIcon from "@mui/icons-material/Bathtub";

const PropertyCard = ({listing}) => {
// Format the price using toLocaleString
  const formattedPrice = listing.regularPrice.toLocaleString();
  return (
    <Card sx={{ maxWidth: 320, margin: 'auto', borderRadius: 1 }}>
      <CardMedia
        component="img"
        height="200"
        // image="https://cdn.pixabay.com/photo/2023/03/29/10/27/hotel-7885138_640.jpg" // Replace with your image UR
        image = {listing.imageUrls[0]}
        alt="property image"
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {listing.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
          <LocationOnIcon color="primary" />
          <Typography variant="body2" color="textSecondary">
            {listing.address}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 ,mb:3, 
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 2,}}>
            {listing.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', marginTop: 1 }}>
            ${listing.offer ? listing.discountPrice.toLocaleString() : formattedPrice}
            {listing.type === 'rent' ? ' / month' : ''}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <Box display="flex" alignItems="center" sx={{mr:1}}>
                <HotelIcon color="primary" />
                <Typography variant="subtitle2" ml={1}>
                  {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
                 
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" sx={{mr:13}} >
                <BathtubIcon color="primary" />
                <Typography variant="body2" ml={1}>
                {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath`}
                </Typography>
              </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
