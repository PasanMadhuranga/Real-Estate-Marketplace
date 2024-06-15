import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { updateUser, deleteUser, getUserListings } from "../controllers/user.controller.js";

const router = express.Router();

//first we verify the token and then we update the user
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);

export default router;
