import React from 'react'
import Button from "@mui/material/Button";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from '../firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);

            const body = {
                username: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL,
            };

            const response = await axios.post("/api/auth/google", body, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            dispatch(signInSuccess(response.data));
            navigate("/")
        } catch (error) {
            console.log("Error with Google Sign In: ", error);
        }
    };
  return (
    <div>
    <Button variant="contained" color='error' fullWidth onClick={handleGoogleClick} sx={{mb: 1}}>CONTINUE WITH GOOGLE</Button>
    </div>
  )
}
