import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUpUser, deleteUser } from "../redux/user/userSlice";
import { TailSpin } from "react-loader-spinner";
import { Box } from "@mui/material";

export default function PrivateRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await axios.get("/api/auth/check-auth");
        setIsAuthenticated(true);
        dispatch(setUpUser(response.data));
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        dispatch(deleteUser());
      }
    }
    checkAuth();
  }, [dispatch]);

  if (isAuthenticated === null) {
    return (
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <TailSpin
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </Box>
    );
  }

  return isAuthenticated ? (
    <Outlet replace />
  ) : (
    <Navigate to="/sign-in" replace />
  );
}
