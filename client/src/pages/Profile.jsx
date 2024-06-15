import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { useEffect } from "react";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function Profile() {
  const fileRef = useRef(null);
  //get the current user to get the avatar
  const { currentUser, loading, error } = useSelector((state) => state.user);
  //this is for the file that will be uploaded
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  //initialize dispatch to use it to dispatch actions
  const dispatch = useDispatch();

  //this useEffect is used to upload the file to the firebase storage
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name; //unique name for the file
    const storageRef = ref(storage, fileName); // the path where the file will be saved
    //This function starts the upload of the file to the specified storage reference (storageRef).
    //It returns an UploadTask which can be used to monitor and control the upload process.
    const uploadTask = uploadBytesResumable(storageRef, file); // the task of uploading the file
    //The on method is an event listener that listens for changes in the state of the upload task.
    //The 'state_changed' event fires multiple times during the upload process to provide updates on the upload status.
    //The on method for the 'state_changed' event takes three callback functions as arguments:
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        //getDownloadURL(uploadTask.snapshot.ref) retrieves the download URL for the uploaded file.
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(updateUserStart());
    const data = new FormData(event.currentTarget);
    const body = {
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
      avatar: formData.avatar || currentUser.avatar,
    };
    try {
      const response = await axios.post(
        `/api/user/update/${currentUser._id}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.success === false) {
        dispatch(updateUserFailure(response.message));
        return;
      }
      dispatch(updateUserSuccess(response.data)); // The object that we pass here will be the payload of the action in the reducer
      setUpdateSuccess(true); // This is used to show the success message
    } catch (error) {
      dispatch(updateUserFailure(error.response.data.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await axios.delete(
        `/api/user/delete/${currentUser._id}`
      );
      if (response.success === false) {
        dispatch(deleteUserFailure(response.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.response.data.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const response = await axios.get("/api/auth/signout");
      if (response.success === false) {
        dispatch(signOutUserFailure(response.response.data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.response.data.message));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4">
          Profile
        </Typography>
        {/* fileRef.current gives direct access to the file input element because fileRef is a reference to that element.
        fileRef.current.click() programmatically triggers a click event on the hidden file input element. This opens the file dialog, allowing the user to select a file. */}
        <input
          onChange={(evt) => setFile(evt.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <Avatar
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          sx={{ mt: 2, bgcolor: "secondary.main", width: 100, height: 100 }}
        />
        {/* //this p elemnt implements the showing of the progress of the file upload */}
        <p>
          {fileUploadError ? (
            <span >
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span >Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="username"
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
                variant="outlined"
                defaultValue={currentUser.username}
                // onChange={handleChange} no need in mui
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                // autoComplete="email"
                variant="outlined"
                defaultValue={currentUser.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                // required
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
            {loading ? "Loading..." : "UPDATE"}
          </Button>

          <Button
            type="text"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2}}
            color="secondary"
            disabled={loading}
            href="/create-listing"
          >
            Create Listing
          </Button>
          

          <Grid container display="flex" justifyContent="space-between">
            <Grid item xs={6} sx={{ textAlign: "left" }}>
              <Button
                variant="text"
                color="error"
                sx={{ textTransform: "none", pl: 1 }}
                onClick={handleDeleteUser}
              >
                Delete Account
              </Button>
            </Grid>

            <Grid item xs={6} style={{ textAlign: "right" }}>
              <Button
                variant="text"
                color="error"
                sx={{ textTransform: "none", pr: 1 }}
                onClick={handleSignOut}
              >
                Sign out
              </Button>
            </Grid>
          </Grid>
        </Box>
        {error && (
          <Alert sx={{ mt: 2 }} severity="error">
            {error}
          </Alert>
        )}
        {updateSuccess && (
          <Alert sx={{ mt: 2 }} severity="success">
            Profile updated successfully
          </Alert>
        )}
      </Box>
    </Container>
  );
}
