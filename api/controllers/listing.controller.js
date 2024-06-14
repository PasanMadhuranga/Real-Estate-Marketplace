import Listing from '../models/listing.model.js';

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body); // This create method creates a new document and saves it to the database
        return res.status(201).json(listing);    
    } catch (error) {
        next(error);
    }
}