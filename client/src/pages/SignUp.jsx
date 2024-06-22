import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OAuth from "../components/OAuth";
import { useSelector, useDispatch } from "react-redux";
import {
  signUpStart,
  signUpSuccess,
  signUpFailure,
} from "../redux/user/userSlice";
import { usernameValidator, emailValidator, passwordValidator } from "../components/inputValidators";
import ValidatedTextField from "../components/ValidatedTextField";
import { useRef } from "react";

export default function SignUp() {
  const isFormValid = useRef({ username: false, email: false, password: false }); // we use useRef because we don't want to re-render the component when the form fields are validated
  const formData = useRef({ username: "", email: "", password: "" });
  const { error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   dispatch(signUpStart());
  //   // FormData is a built-in JavaScript object that easily captures the data from the form fields.
  //   // event.currentTarget refers to the form element, and new FormData(event.currentTarget) captures all the form data in a structured way.
  //   const body = {...formData};

  //   try {
  //     const response = await axios.post("/api/auth/signup", body, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     dispatch(signUpSuccess(response.data));
  //     navigate("/");
  //   } catch (error) {
  //     // this error is an Axios error object, which contains a response object with the error message.
  //     dispatch(signUpFailure(error.response.data.message));
  //   }
  //   // "/api/users": The URL to which the request is sent. This is typically an endpoint on your server that handles user registration.
  //   // method: "POST": Specifies that this is a POST request, meaning data will be sent to the server.
  //   // headers: {"Content-Type": "application/json"}: Sets the Content-Type header to application/json, indicating that the request body contains JSON data.
  //   // body: JSON.stringify(body): Converts the body object (which contains the form data) to a JSON string to be sent as the request body.
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(signUpStart());
    if (Object.values(isFormValid.current).every((isValid) => isValid)) { // Check if all form fields are valid
      const body = { ...formData.current };
      try {
        const response = await axios.post("/api/auth/signup", body, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        dispatch(signUpSuccess(response.data));
        navigate("/");
      } catch (error) {
        dispatch(signUpFailure(error.response.data.message));
      }
    } else {
      dispatch(signUpFailure("Invalid form data"));
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h3">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* <TextField
                name="username"
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
                variant="outlined"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              /> */}
              <ValidatedTextField
                label="Username"
                validator={usernameValidator}
                onChangeFunc={(isValid, value) => {
                  isFormValid.current.username = isValid;
                  formData.current.username = value;
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                // autoComplete="email"
                value={formData.email}
                variant="outlined"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              /> */}
              <ValidatedTextField
                label="Email"
                validator={emailValidator}
                onChangeFunc={(isValid, value) => {
                  isFormValid.current.email = isValid;
                  formData.current.email = value;
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                // autoComplete="new-password"
                variant="outlined"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              /> */}
              <ValidatedTextField
                label="Password"
                validator={passwordValidator}
                onChangeFunc={(isValid, value) => {
                  isFormValid.current.password = isValid;
                  formData.current.password = value;
                }}
                type="password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"}
          </Button>
          <OAuth />

          <Link href="/sign-in" variant="body2">
            Already have an account? Sign in
          </Link>
        </Box>
        {error && (
          <Alert sx={{ mt: 2 }} severity="error">
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
