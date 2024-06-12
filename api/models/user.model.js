import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required."],
        unique: true,
    },  
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
    }, 

    }, { timestamps: true })

const User = mongoose.model("User", userSchema);

// This is the modern way to export modules using ES6 syntax. 
// For export default, you use import. 
export default User;