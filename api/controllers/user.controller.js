import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  if(req.user.id !== req.params.id) return next(errorHandler(401, "You can update only your account" ));
  
  try {
    let updateUserInfo;
    //if the user wants to update the password, we hash it
    if(req.body.password){
      req.body.password = await bcryptjs.hash(req.body.password, 10);
      updateUserInfo = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      }
    } else {
      updateUserInfo = {
        username: req.body.username,
        email: req.body.email,
        avatar: req.body.avatar,
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      //we use $set to update only the fields that are passed in the request and only thsese fields can be updated 
      //but if we use ...req.body , it is a risk that the user can update any field by creating a new field in the request
      // by new true we get the updated user back as a response
      $set: updateUserInfo,
    }, {new: true});
    //Using destructuring, extract the password field and rename it to hashedPassword (for clarity, though you don't use hashedPassword afterward).
    const {password: hashedPassword, ...restOfUser} = updatedUser._doc;
    res.status(200).json(restOfUser);

  } catch(error){
    next(error);
  }
}