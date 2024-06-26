import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userRef,
    } = req.body;

    // Verify the user exists
    const user = await User.findById(userRef);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Create a new listing
    const newListing = new Listing({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userRef,
    }); //otherwise we can pass req.body directly without destructuring as above

    // Save the listing to the database
    const listing = await newListing.save();

    // Optionally, add the listing to the user's listings array
    user.listings.push(listing._id);
    await user.save();

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return next(errorHandler(404, "Listing not found"));
      }
  
      if (!listing.userRef.equals(req.user.id)) {
        return next(errorHandler(401, "You can delete only your listings"));
      }
  
      // Remove the listing from the user's listings array
      await User.updateOne(
        { _id: listing.userRef },
        { $pull: { listings: listing._id } }
      );
  
      // Delete the listing
      await Listing.findByIdAndDelete(req.params.id);
  
      return res.status(200).json("Listing has been deleted");
    } catch (error) {
      next(error);
    }
  };


  export const editListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, "Listing not found"));
        }
        if (!listing.userRef.equals(req.user.id)) {
            return next(errorHandler(401, "You can edit only your listings"));
        }

        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {new: true});
        return res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
}    

// Get a single listing
export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, "Listing not found"));
        }
        return res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}
// Get all listings
export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;

        if(offer === undefined || offer === 'false') {
            offer = {$in:[false, true]};
        }

        let furnished = req.query.furnished;

        if(furnished === undefined || furnished === 'false') {
          furnished = {$in:[false, true]};
        }
        
        let parking = req.query.parking;
        if(parking === undefined || parking === 'false') {
          parking = {$in:[false, true]};
        }

        let type = req.query.type;
        if(type === undefined || type === 'all') {
          type = {$in:['sale', 'rent']};
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';


        //this is the query to get the listings
        //it will return all the listings that match the search term
        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        }).sort({ [sort]: order }).limit(limit).skip(startIndex);
        // console.log(listings);
        // .limit(limit): Limits the number of documents returned to the value of limit.
        // .skip(startIndex): Skips the first startIndex documents. Useful for pagination
        return res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
}