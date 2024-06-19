import express from "express";
import {
  signup,
  signin,
  google,
  signout,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/middleware.js";
import { validateSignIn, validateSignUp, validateGoogleLogin } from "../utils/middleware.js";

const router = express.Router();

router.post("/signup", validateSignUp, signup);
router.post("/signin", validateSignIn, signin);
router.post("/google", validateGoogleLogin, google);
router.get("/signout", verifyToken, signout);

export default router;
