import React from 'react'
import PropertyCard from '../components/PropertyCard'


const listing = {
  "_id": "666f37b525ee1e2e3b379784",
  "name": "Artisan's Alley",
  "description": "A vibrant arts and crafts store featuring handmade goods from local artisans, art supplies, and creative workshops.",
  "address": "101 Pine Street, Artisanville, OR 97031",
  "regularPrice": 555777,
  "discountPrice": 300,
  "bathrooms": 4,
  "bedrooms": 1,
  "furnished": true,
  "parking": true,
  "type": "rent",
  "offer": true,
  "imageUrls": [
    "https://firebasestorage.googleapis.com/v0/b/real-estate-marketplace-f7384.appspot.com/o/1718564602701pexels-pixabay-261101.jpg?alt=media&token=2a798954-a732-4c4d-9a65-72113ce52b6c",
    "https://firebasestorage.googleapis.com/v0/b/real-estate-marketplace-f7384.appspot.com/o/1718564602704pexels-naimbic-2290738.jpg?alt=media&token=9e4dd27e-f8aa-486c-9d3d-d4149a9f2189",
    "https://firebasestorage.googleapis.com/v0/b/real-estate-marketplace-f7384.appspot.com/o/1718564602705pexels-pixabay-261102.jpg?alt=media&token=6ce42180-f31e-43be-9b8a-dbe87d05f2b5"
  ],
  "userRef": "666f1e92b4c68870821352a6",
  "createdAt": "2024-06-16T19:06:29.374Z",
  "updatedAt": "2024-06-16T19:06:29.374Z",
  "__v": 0
}
export default function Home() {
  return (
    <div>
      <PropertyCard listing={listing}/>
    </div>
  )
}
