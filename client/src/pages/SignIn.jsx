import { useState } from "react";
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

export default function SignIn() {

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // FormData is a built-in JavaScript object that easily captures the data from the form fields.
    // event.currentTarget refers to the form element, and new FormData(event.currentTarget) captures all the form data in a structured way.
    const data = new FormData(event.currentTarget);
    const body = {
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      await axios.post("/api/auth/signin", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      setError(null);
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
    // "/api/users": The URL to which the request is sent. This is typically an endpoint on your server that handles user registration.
    // method: "POST": Specifies that this is a POST request, meaning data will be sent to the server.
    // headers: {"Content-Type": "application/json"}: Sets the Content-Type header to application/json, indicating that the request body contains JSON data.
    // body: JSON.stringify(body): Converts the body object (which contains the form data) to a JSON string to be sent as the request body.
  };

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
                // autoComplete="email"
                variant="outlined"
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
                // autoComplete="new-password"
                variant="outlined"
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

          <Link href="/sign-up" variant="body2">
            Don't have an account? Sign up
          </Link>
        </Box>
        {error && <Alert sx={{mt: 2}} severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
}
