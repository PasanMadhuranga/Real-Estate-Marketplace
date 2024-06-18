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
import { useState, useEffect } from "react";
import { app } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useSelector } from "react-redux";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "@mui/material";

export default function EditListing() {
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
    regularPrice: 0,
    discountPrice: 0,
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const params = useParams(); //to get the listing id to load the edit-listing page with respective data

  const { currentUser } = useSelector((state) => state.user);


  const handleImageSubmit = (e) => {
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
          setImageUploadError("Image Upload failed(2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
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
          console.log(`Upload is ${progress}% done`);
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

  // console.log("formdata", formData);
  //use this fetch data when edit a listing page is loaded
  //this effect will run only once when the component is mounted. since [] is passed as the second argument to useEffect
  //since it is not allowed to use async function as useEffect callback, we use an async function inside the useEffect callback
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      try {
        const response = await axios.get(`/api/listing/get/${listingId}`);
        if (response.success === false) {
          console.log(response.error);
          return;
        }
        // console.log("response.data", response.data);
        setFormData(response.data);
      } catch (error) {}
    };
    fetchListing();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const body = {
        ...formData,
        userId: currentUser._id,
      };
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

      const response = await axios.post(
        `/api/listing/edit/${params.listingId}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
          Edit a Listing
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
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                value={formData.name}
                multiline
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                <strong>Images:</strong> The first image will be the cover (max
                6)
              </Typography>

              <Box sx={{ border: "1px solid grey", p: 2 }}>
                <input
                  onChange={(e) => setFiles(e.target.files)} //
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
                {uploading ? "Uploading..." : "Upload Images"}
              </Button>
              {imageUploadError && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {imageUploadError}
                </Typography>
              )}
              {/* this displays the images that are uploaded */}
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
                autoFocus
                // variant="filled"
                inputProps={{ minLength: 3 }}
                multiline
                rows={2}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                value={formData.description}
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
                // variant="filled"
                multiline
                rows={2}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                value={formData.address}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <RadioGroup
                    row
                    aria-labelledby="sell-rent-group"
                    name="sell-rent-group"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <FormControlLabel
                      value="sell"
                      control={<Radio color="success" />}
                      label="Sell"
                    />
                    <FormControlLabel
                      value="rent"
                      control={<Radio color="success" />}
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
                          checked={formData.parking || false}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              parking: e.target.checked,
                            })
                          }
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
                          checked={formData.furnished || false}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              furnished: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Furnished"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="success"
                          name="Offer"
                          id="Offer"
                          checked={formData.offer || false}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              offer: e.target.checked,
                            })
                          }
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
                    type="number"
                    label="Beds"
                    variant="outlined"
                    fullWidth
                    min={1}
                    max={20}
                    name="bedrooms"
                    id="bedrooms"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bedrooms: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    type="number"
                    label="Bathrooms"
                    variant="outlined"
                    fullWidth
                    min={1}
                    max={20}
                    name="bathrooms"
                    id="bathrooms"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bathrooms: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    type="number"
                    label={
                      formData.type === "rent"
                        ? "Regular Price ($/Month)"
                        : "Regular Price ($)"
                    }
                    variant="outlined"
                    fullWidth
                    min={1}
                    max={1000000}
                    name="regularPrice"
                    id="regularPrice"
                    value={formData.regularPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, regularPrice: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    type="number"
                    label={
                      formData.type === "rent"
                        ? "Discount Price ($/Month)"
                        : "Discount Price ($)"
                    }
                    variant="outlined"
                    fullWidth
                    min={1}
                    max={1000000}
                    name="discountPrice"
                    id="discountPrice"
                    value={formData.discountPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPrice: e.target.value,
                      })
                    }
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
            {loading ? "Loading..." : "UPDATE LISTING"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
