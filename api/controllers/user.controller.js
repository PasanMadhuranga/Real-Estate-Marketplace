import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can update only your account"));

  try {
    // if the user has sent a password, we hash it and update the user
    let updateUserInfo;
    if (req.body.password) {
      req.body.password = await bcryptjs.hash(req.body.password, 10);
      updateUserInfo = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      };
    }
    // if the user has not sent a password, we update the user without the password
    else {
      updateUserInfo = {
        username: req.body.username,
        email: req.body.email,
        avatar: req.body.avatar,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        //we use $set to update only the fields that are passed in the request and only thsese fields can be updated
        //but if we use ...req.body , it is a risk that the user can update any field by creating a new field in the request
        // by new true we get the updated user back as a response
        $set: updateUserInfo,
      },
      { new: true }
    );
    //Using destructuring, extract the password field and rename it to hashedPassword (for clarity, though you don't use hashedPassword afterward).
    const { password: hashedPassword, ...restOfUser } = updatedUser._doc;
    res.status(200).json(restOfUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can delete only your account"));

  try {
    // Find the user and their listings
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found"));

    // Delete the user (Listings deletion is handled in the post-hook)
    await User.findByIdAndDelete(req.params.id);

    res.clearCookie("access_token");
    res.status(200).json("User and their listings have been deleted");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can get only your listings"));

  try {
    const user = await User.findById(req.params.id).populate("listings");
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json(user.listings);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found"));
    const { password, ...restOfUser } = user._doc
    res.status(200).json(restOfUser);
  } catch (error) {
    next(error);
  }
};

