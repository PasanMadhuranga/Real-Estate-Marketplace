import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  updateUser,
  deleteUser,
  getUserListings,
  getUser
} from "../controllers/user.controller.js";

const router = express.Router();

//first we verify the token and then we update the user
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUser); 
// in Profile component we get the user data from redux because we need the current user data. Also we can get the user data from this api
// in Conact component we fetch the user details from this api
export default router;
