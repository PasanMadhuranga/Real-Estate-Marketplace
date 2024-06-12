import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {errorHandler} from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res,next) => {
    // console.log(req.body);
    const {username, email, password} = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({username, email, password:hashedPassword});
    //if there are duplicate emails, the user will not be saved
    try {
        await newUser.save();
        res.status(201).json("User created successfully");
    } catch(error){
        next(error);
        // res.status(500).json(error.message);
        // this error can be used situations like when we want to raise and error ex: password is not long enough
        // next(errorHandler(502, error.message));
    }
    
};

export const signin = async (req,res,next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404, "User not found"));

        const validPassword = await bcryptjs.compare(password, validUser.password);
        if(!validPassword) return next(errorHandler(401, "Invalid username or password"));

        // If the credentials are valid, the server generates a JWT containing the user's ID and signs it with a secret key.
        // This is the secret key used to sign the JWT. It should be a long, random string stored securely in your environment variables.
        // The secret key ensures that the token cannot be tampered with. Only the server knows this key, so it can verify that the token it receives in subsequent requests is legitimate.
        const token = jwt.sign({id:validUser._id}, process.env.JWT_SECRET);
        //The password is excluded from the user object to avoid sending it back to the client.
        const {password:hashedPassword, ...restOfUser} = validUser._doc;
        // By setting a cookie with the JWT, the server can ensure that the client will include this token in future requests. 
        //This token is used to authenticate subsequent requests without the need for the user to re-enter their credentials.
        // The generated token is sent to the client in an HTTP-only cookie for security.
        // The user data (excluding the password) is sent back in the response.
        res.cookie('access_token', token, { httpOnly: true}).status(200).json(restOfUser);

    } catch(error){
        next(error);
    }

}    