import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { useState } from "react";
import { app } from "../firebase";
import {getStorage,ref,uploadBytesResumable, getDownloadURL, deleteObject,} from "firebase/storage";
import { useSelector } from "react-redux";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";

// const VisuallyHiddenInput = styled("input")({
//   clip: "rect(0 0 0 0)",
//   clipPath: "inset(50%)",
//   height: 1,
//   overflow: "hidden",
//   position: "absolute",
//   bottom: 0,
//   left: 0,
//   whiteSpace: "nowrap",
//   width: 1,
// });

export default function CreateListing() {
  const [files, setFiles] = useState([]); //to choose the files
  const [loading, setLoading] = useState(false);
  // const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "sell",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: undefined,
    discountPrice: undefined,
    imageUrls: [],
  });
  
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  console.log("formdata" ,formData)
  const handleImageSubmit = (e) => {
    console.log("insidehandlesubmit");
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError("");

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError("");
          setUploading(false);
        })
        .catch((error) => {
          // console.log(error);
          setImageUploadError("Image Upload failed(2 mb max per image)");
          setUploading(false);
        });
    } else {
      console.log("inside else");
      setImageUploadError("You can only upload 6 images");
      setUploading(false);
    }
  };

  //Great question! The resolve and reject functions are used inside the promise to indicate the completion (success or failure) of the asynchronous operation. 
  //The .then and .catch methods are used to handle the outcome of the promise once it has been resolved or rejected.
  const storeImage = async (file) => {
    //When you create a promise, you provide an executor function that performs the asynchronous operation. Within this function:
    // resolve is called when the operation completes successfully.
    // reject is called when the operation fails.
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };
  //(_, i) is the callback function used by filter. The underscore _ represents the current element (which we don't need in this case), and i is the index of the current element.
  const handleDeleteImage = (index) => {
    const storage = getStorage(app);
    const imageRef = ref(storage, formData.imageUrls[index]);
    deleteObject(imageRef)
      .then(() => {
        console.log("Image deleted successfully");
        const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
        setFormData({ ...formData, imageUrls: newImageUrls });
      })
      .catch((error) => {
        console.log("Error deleting image", error);
      });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    setLoading(true);
    const body = {...formData,userRef: currentUser._id};
    if (body.imageUrls.length === 0) {
      setError("Please upload at least one image");
      setLoading(false);
      return;
    }

    if (Number(body.discountPrice) > Number(body.regularPrice)) {
      setError("Discount price cannot be greater than regular price");
      setLoading(false);
      return;
    }

    const response = await axios.post("/api/listing/create", body, 
    {
      headers: {
        "Content-Type": "application/json",
      },
    });    
    setLoading(false);
    if (response.success === false) {
      setError(response.message);
    }
    navigate(`/listing/${response.data._id}`); //redirect to the listing page after creating the listing
  } catch (error) {
    setLoading(false);
    setError(error.response.data.message);
  }
  };

  return (
    // using main this makes SEO friendly
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h3">
          Create a Listing
        </Typography>
        <Box component="form" sx={{ mt: 5 }} onSubmit={handleSubmit}>
          {error && (
            <Alert sx={{ mb: 2 }} severity="error">
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                label="Name"
                variant="filled"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                <strong>Images:</strong> The first image will be the cover (max
                6)
              </Typography>

              <Box sx={{ border: "1px solid grey", p: 2 }}>
                <input
                  onChange={(evt) => setFiles(Array.from(evt.target.files))}
                  type="file"
                  multiple
                  accept="image/*"
                />
              </Box>
              <Button
                onClick={handleImageSubmit}
                disabled={uploading}
                startIcon={<CloudUploadIcon />}
                sx={{ textTransform: "none" }}
                type="button"
              >
                {" "}
                {uploading ? "Uploading..." : "Upload Images"}
              </Button>
              {imageUploadError && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {" "}
                  {imageUploadError}{" "}
                </Typography>
              )}
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                  <Box key={url} sx={{ display: "flex", mb: 1 }}>
                    <img
                      src={url}
                      alt="listing image"
                      width="100"
                      height="100"
                    />
                    <Button
                      sx={{ textTransform: "none", marginLeft: 1 }}
                      onClick={() => handleDeleteImage(index)}
                    >
                      Delete
                    </Button>
                  </Box>
                ))}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="description"
                required
                fullWidth
                id="description"
                label="Description"
                variant="filled"
                inputProps={{ minLength: 10 }}
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="address"
                required
                fullWidth
                id="address"
                label="Address"
                autoFocus
                variant="filled"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <RadioGroup
                    row
                    aria-labelledby="sell-rent"
                    defaultValue="sell"
                    name="sell-rent-group"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <FormControlLabel
                      value="sell"
                      control={<Radio />}
                      label="Sell"
                    />
                    <FormControlLabel
                      value="rent"
                      control={<Radio />}
                      label="Rent"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item xs={8}>
                  <FormGroup
                    row={true}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="success"
                          name="ParkingSpot"
                          id="ParkingSpot"
                          checked={formData.parking}
                          onChange={(e) => setFormData({...formData,parking: e.target.checked,})}
                        />
                      }
                      label="ParkingSpot"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="success"
                          name="Furnished"
                          id="Furnished"
                          checked={formData.furnished}
                          onChange={(e) => setFormData({...formData,furnished: e.target.checked,})}
                        />
                      }
                      label="Furnished"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                        color="success" 
                        name="Offer" id="Offer" 
                        onChange={(e) => setFormData({...formData,offer: e.target.checked,})}
                        />
                      }
                      label="Offer"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <TextField
                    label="Bedrooms"
                    type="number"
                    variant="outlined"
                    fullWidth
                    name="bedrooms"
                    id="bedrooms"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    label="Bathrooms"
                    type="number"
                    variant="outlined"
                    fullWidth
                    name="bathrooms"
                    id="bathrooms"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    label={formData.type === "rent" ? "Regular Price ($/Month)" : "Regular Price ($)"}
                    type="number"
                    variant="outlined"
                    fullWidth
                    name="regularPrice"
                    id="regularPrice"
                    value={formData.regularPrice}
                    onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                <TextField
                  label={formData.type === "rent" ? "Discount Price ($/Month)" : "Discount Price ($)"}
                  type="number"
                  variant="outlined"
                  fullWidth
                  name="discountPrice"
                  id="discountPrice"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 3 }}
            size="large"
            disabled={loading}
          >
            {loading ? "Loading..." : "CREATE LISTING"}
          </Button>
        </Box>
        {/* {error && (
          <Alert sx={{ mt: 2 }} severity="error">
            {error}
          </Alert>
        )} */}
      </Box>
    </Container>
  );
}
