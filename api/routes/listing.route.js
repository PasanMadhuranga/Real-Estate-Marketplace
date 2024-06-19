import express from "express";
import {
  createListing,
  deleteListing,
  editListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/middleware.js";
import { validateCreateListing, validateEditListing } from "../utils/middleware.js";

const router = express.Router();

router.post("/create", verifyToken, validateCreateListing, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/edit/:id", verifyToken, validateEditListing, editListing);
router.get("/get/:id", getListing); //show listing
router.get("/get", getListings); //show all listings when doing a search

export default router;
