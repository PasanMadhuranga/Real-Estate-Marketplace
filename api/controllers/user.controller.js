import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({ message: "Damn World" });
};


export const updateUser = async (req, res,next) => {
  if(req.user.id !== req.params.id) return next(errorHandler(401,"You can update only your account" ));
  
  try {
    //if the user wants to update the password, we hash it
    if(req.body.password){
      req.body.password = await bcryptjs.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      //we use $set to update only the fields that are passed in the request and only thsese fields can be updated 
      //but if we use ...req.body , it is a risk that the user can update any field by creating a new field in the request
      // by new true we get the updated user back as a response
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      },
    }, {new: true});

    const {hashedPassword, ...restOfUser} = updatedUser._doc;
    res.status(200).json(restOfUser);

  } catch(error){
    next(error);
  }
}