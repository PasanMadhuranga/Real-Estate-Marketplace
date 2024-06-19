import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";
import {
  createListingSchema,
  editListingSchema,
  signInSchema,
  signUpSchema,
  googleLoginSchema,
  updateProfileSchema,
} from "./validationSchemas.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "Unauthorized"));

  //actually here we use id of the user to verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));
    //This makes the user information available to any subsequent middleware functions and route handlers.
    req.user = user; // we can use this in update and delete user controllers
    // { id: '6669da0690843450770001f2', iat: 1718306411 }
    // console.log(user, req.user); both are same
    next();
  });
};

export const validateCreateListing = (req, res, next) => {
  const { error } = createListingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(errorHandler(400, msg));
  } else {
    next();
  }
};

export const validateEditListing = (req, res, next) => {
  const { error } = editListingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(errorHandler(400, msg));
  } else {
    next();
  }
};

export const validateSignIn = (req, res, next) => {
  const { error } = signInSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(errorHandler(400, msg));
  } else {
    next();
  }
};

export const validateSignUp = (req, res, next) => {
  const { error } = signUpSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(errorHandler(400, msg));
  } else {
    next();
  }
};

export const validateGoogleLogin = (req, res, next) => {
  const { error } = googleLoginSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(errorHandler(400, msg));
  } else {
    next();
  }
};

export const validateUpdateProfile = (req, res, next) => {
  const { error } = updateProfileSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(errorHandler(400, msg));
  } else {
    next();
  }
};
