import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {errorHandler} from "../utils/error.js";

export const signup = async (req, res,next) => {
    // console.log(req.body);
    const {username, email, password} = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({username, email, password:hashedPassword});
    //if there are duplicate emails, the user will not be saved
    try {
        await newUser.save();
        res.status(200).json("User created successfully");
    } catch(error){
        next(error);
        // res.status(500).json(error.message);
        //this error can be used situations like when we want to raise and error ex: password is not long enough
        // next(errorHandler(502, error.message));
    }
    
};