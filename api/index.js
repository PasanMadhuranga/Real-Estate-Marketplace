import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
// const dbUrl = process.env.MONGO_DB_URL;
const dbUrl = "mongodb://127.0.0.1:27017/mern-estate"

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error.message);
  });

app.use(express.json());
//The cookieParser() middleware parses the Cookie header of incoming requests and populates req.cookies with an object keyed by the cookie names
//This middleware is essential for working with cookies in a Node.js application using the Express framework
app.use(cookieParser())
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use('/api/listing', listingRouter);

//The cors() middleware is used to enable Cross-Origin Resource Sharing (CORS) in an Express.js application
//CORS is a mechanism that allows resources on a web page to be requested from another domain outside the domain from which the resource originated
//This middleware is used to allow requests from all origins and with credentials
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true, // Allow credentials (cookies) to be included in requests
}));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  //in ES6 if var and key are the same, you can just write the key
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
