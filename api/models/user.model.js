import mongoose from "mongoose";
import Listing from "./listing.model.js";

const userSchema = new mongoose.Schema(
  {
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
    avatar: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    listings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
  },
  { timestamps: true }
);

// Post hook to delete associated listings after a user is deleted
userSchema.post("findOneAndDelete", async function (user) {
  if (user.listings.length) {
    await Listing.deleteMany({ _id: { $in: user.listings } });
  }
});

const User = mongoose.model("User", userSchema);

// This is the modern way to export modules using ES6 syntax.
// For export default, you use import.
export default User;
