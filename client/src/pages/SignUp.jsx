import { useEffect,useState } from "react";
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
  clearError,
} from "../redux/user/userSlice";

import Snackbar from '@mui/material/Snackbar';
import { red } from '@mui/material/colors';

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../validationSchemas";

export default function SignUp() {
  const { error, loading } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false); // State to manage Snackbar visibility

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //this use to avoid displaying old errors even after refrehsing the page
  useEffect(() => {
    dispatch(clearError()); // Clear error state when the component mounts
  }, [dispatch]);

  // useEffect to open the Snackbar whenever there is an error
  useEffect(() => {
    if (error) {
      setOpen(true); // Open the Snackbar if there's an error
    }
  }, [error]); // Dependency array: runs the effect whenever `error` changes

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false); // Close the Snackbar
    dispatch(clearError()); // Clear error state when Snackbar is closed
  };
  const onSubmit = async (data) => {
    dispatch(signUpStart());
    try {
      const response = await axios.post("/api/auth/signup", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch(signUpSuccess(response.data));
      navigate("/");
    } catch (error) {
      dispatch(signUpFailure(error.response.data.message));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      { error && 
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}  anchorOrigin={{vertical:'top',horizontal:'left'}}>
            <Alert onClose={handleClose} severity="error" variant="filled" sx={{width:'100%',bgcolor:red[400]}}>
              {error}
            </Alert>
        </Snackbar>
      } 
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
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id="username"
                    label="Username"
                    autoFocus
                    variant="outlined"
                    error={!!errors.username}
                    helperText={errors.username?.message} // This is similar to errors.username && errors.username.message
                    color="success"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id="email"
                    label="Email Address"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    color="success"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    color="success"
                  />
                )}
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
      </Box>
    </Container>
  );
}
