import express from "express";
import { test } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test", test);
//first we verify the token and then we update the user
router.post('/update/:id', verifyToken, updateUser);

export default router;
