import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box,Link } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
// import BedIcon from "@mui/icons-material/Bed";
import HotelIcon from '@mui/icons-material/Hotel';
import BathtubIcon from "@mui/icons-material/Bathtub";

const PropertyCard = ({listing}) => {
// Format the price using toLocaleString
  const formattedPrice = listing.regularPrice.toLocaleString();
  return (
    <Link href={`/listing/${listing._id}`}  underline='none'> 
    <Card 
     sx={{ maxWidth: 320, margin: 'auto', borderRadius: 1,height:460 ,textDecoration: 'none'}}  >
        <Box sx={{ height: "200px"}}>
          <CardMedia
            component="img"
            sx={{ height: 200, objectFit: "cover" }}
            image={listing.imageUrls[0]}
            alt="property image"
          />
        </Box>
      <CardContent>
        <Typography variant="h6" gutterBottom
          sx={{display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          WebkitLineClamp: 1,}}
        >
          {listing.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
          <LocationOnIcon color="primary" />
          <Typography variant="body2" color="textSecondary" 
            sx={{display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 2,}}
          >
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
              <Box display="flex" alignItems="center" >
                <HotelIcon color="primary" />
                <Typography variant="subtitle2" ml={1}>
                  {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center"  >
                <BathtubIcon color="primary" />
                <Typography variant="body2" ml={1}>
                {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath`}
                </Typography>
              </Box>
        </Box>
      </CardContent>
    </Card>
    </Link>
  );
};

export default PropertyCard;
