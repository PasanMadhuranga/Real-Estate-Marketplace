import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure,clearError } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { useState,useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import { red } from '@mui/material/colors';


export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [open, setOpen] = useState(false); // State to manage Snackbar visibility
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  //function to handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(signInStart());

    const body = { ...formData };

    try {
      const response = await axios.post("/api/auth/signin", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch(signInSuccess(response.data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.response.data.message));
    }
  };
 
  return (
    <Container component="main" maxWidth="xs">
      {/* // Snackbar to display error messages if only there is an error */}
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
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                variant="outlined"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                color="success"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                variant="outlined"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                color="success"
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
            {loading ? "Loading..." : "Sign In"}
          </Button>
          <OAuth />

          <Link href="/sign-up" variant="body2">
            Don't have an account? Sign up
          </Link>
        </Box>
        
      </Box>
    </Container>
  );
}
