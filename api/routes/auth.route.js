import express from "express";
import {
  signup,
  signin,
  google,
  signout,
  getAuthUser
} from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/middleware.js";
import { validateSignIn, validateSignUp, validateGoogleLogin } from "../utils/middleware.js";

const router = express.Router();

router.post("/signup", validateSignUp, signup);
router.post("/signin", validateSignIn, signin);
router.post("/google", validateGoogleLogin, google);
router.get("/signout", verifyToken, signout);
router.get("/check-auth", verifyToken, getAuthUser); // This route is to check if the user has a valid token
export default router;
