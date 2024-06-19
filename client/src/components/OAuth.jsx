import React from "react";
import Button from "@mui/material/Button";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInFailure, signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    try {
        // GoogleAuthProvider: A class that creates a new Google provider instance.
      const provider = new GoogleAuthProvider();
        // getAuth(app): Returns the Auth service for the given FirebaseApp instance.
      const auth = getAuth(app);
        // signInWithPopup(auth, provider): Signs in the user with the given provider using a pop-up window.
      const result = await signInWithPopup(auth, provider);

      const body = {
        username: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
      };

      const response = await axios.post("/api/auth/google", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch(signInSuccess(response.data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <Button
      variant="contained"
      color="error"
      fullWidth
      onClick={handleGoogleClick}
      sx={{ mb: 1 }}
    >
      CONTINUE WITH GOOGLE
    </Button>
  );
}
