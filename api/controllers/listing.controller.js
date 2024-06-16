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
    });

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