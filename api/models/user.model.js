import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },  
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }, 

    }, { timestamps: true })

const User = mongoose.model("User", userSchema);

// This is the modern way to export modules using ES6 syntax. 
// For export default, you use import. 
export default User;