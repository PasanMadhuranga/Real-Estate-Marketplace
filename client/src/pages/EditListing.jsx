import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "@mui/material";
import { Card, CardMedia, CardActions } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { listingSchema } from "../validationSchemas";
import Snackbar from "@mui/material/Snackbar";
import { red } from "@mui/material/colors";
import { useDispatch } from "react-redux";
import { clearError } from "../redux/user/userSlice";

export default function EditListing() {
  const [files, setFiles] = useState([]); //to choose the files
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // State to manage Snackbar visibility
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  // State for non-validated form data
  const [nonValidatedFormData, setNonValidatedFormData] = useState({
    type: "sale",
    parking: false,
    furnished: false,
    offer: false,
    imageUrls: [],
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(listingSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams(); //to get the listing id to load the edit-listing page with respective data

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
    if (reason === "clickaway") {
      return;
    }
    setOpen(false); // Close the Snackbar
    dispatch(clearError()); // Clear error state when Snackbar is closed
  };

  //use this fetch data when edit a listing page is loaded
  //this effect will run only once when the component is mounted. since [] is passed as the second argument to useEffect
  //since it is not allowed to use async function as useEffect callback, we use an async function inside the useEffect callback
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      try {
        const response = await axios.get(`/api/listing/get/${listingId}`);
        if (response.success === false) {
          setError(response.message);
          return;
        }
        // console.log("response.data", response.data);
        const {
          name,
          description,
          address,
          type,
          parking,
          furnished,
          offer,
          bedrooms,
          bathrooms,
          regularPrice,
          discountPrice,
          imageUrls,
        } = response.data;
        setNonValidatedFormData({
          type,
          parking,
          furnished,
          offer,
          imageUrls,
        });
        reset({
          name,
          description,
          address,
          bedrooms,
          bathrooms,
          regularPrice,
          discountPrice,
        });
      } catch (error) {
        setError(error.response.data.message);
      }
    };
    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length === 0) {
      setImageUploadError("Please select an image");
    } else if (files.length + nonValidatedFormData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError("");

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...nonValidatedFormData,
            imageUrls: nonValidatedFormData.imageUrls.concat(urls),
          });
          setImageUploadError("");
          setUploading(false);
          setFiles([]); /// newly added by pasan
        })
        .catch((error) => {
          // console.log(error);
          setImageUploadError("Image Upload failed(5 mb max per image)");
          setUploading(false);
        });
    } else {
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
    const imageRef = ref(storage, nonValidatedFormData.imageUrls[index]);
    deleteObject(imageRef)
      .then(() => {
        const newImageUrls = nonValidatedFormData.imageUrls.filter((_, i) => i !== index);
        setFormData({ ...nonValidatedFormData, imageUrls: newImageUrls });
      })
      .catch((error) => {
        setError("Failed to delete image");
      });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const body = {
        ...data,
        ...nonValidatedFormData,
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
    <Container component="main" maxWidth="lg">
      {error && (
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Alert
            onClose={handleClose}
            severity="error"
            variant="filled"
            sx={{ width: "100%", bgcolor: red[400] }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
      <Box
        sx={{
          mt: 8,
          display: "flex",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Typography component="h1" variant="h3">
          Edit a Listing
        </Typography>
      </Box>
      <Grid
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        container
        spacing={3}
      >
        <Grid item xs={12} md={6}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                id="name"
                label="Name"
                autoFocus
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
                color="success"
                sx={{ my: 1 }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                id="description"
                label="Description"
                variant="outlined"
                error={!!errors.description}
                helperText={errors.description?.message}
                color="success"
                sx={{ my: 1 }}
                multiline
                rows={3}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                id="address"
                label="Address"
                variant="outlined"
                error={!!errors.address}
                helperText={errors.address?.message}
                color="success"
                sx={{ my: 1 }}
                multiline
                rows={2}
              />
            )}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <RadioGroup
              row
              aria-label="listingType"
              name="listingType"
              value={nonValidatedFormData.type}
              onChange={(e) =>
                setNonValidatedFormData({
                  ...nonValidatedFormData,
                  type: e.target.value,
                })
              }
            >
              <FormControlLabel
                value="sale"
                control={<Radio color="success" />}
                label="Sale"
              />
              <FormControlLabel
                value="rent"
                control={<Radio color="success" />}
                label="Rent"
              />
            </RadioGroup>

            <FormGroup row={true} sx={{ justifyContent: "space-between" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="success"
                    name="ParkingSpot"
                    id="ParkingSpot"
                    checked={nonValidatedFormData.parking}
                    onChange={(e) =>
                      setNonValidatedFormData({
                        ...nonValidatedFormData,
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
                    checked={nonValidatedFormData.furnished}
                    onChange={(e) =>
                      setNonValidatedFormData({
                        ...nonValidatedFormData,
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
                    onChange={(e) =>
                      setNonValidatedFormData({
                        ...nonValidatedFormData,
                        offer: e.target.checked,
                      })
                    }
                  />
                }
                label="Offer"
              />
            </FormGroup>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Controller
              name="bedrooms"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Bedrooms *"
                  type="number"
                  variant="outlined"
                  sx={{ width: { xs: 180, sm: 300, md: 250 } }}
                  color="success"
                  error={!!errors.bedrooms}
                  helperText={errors.bedrooms?.message}
                />
              )}
            />

            <Controller
              name="bathrooms"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Bathrooms *"
                  type="number"
                  variant="outlined"
                  sx={{ width: { xs: 180, sm: 300, md: 250 } }}
                  color="success"
                  error={!!errors.bathrooms}
                  helperText={errors.bathrooms?.message}
                />
              )}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Controller
              name="regularPrice"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label={
                    nonValidatedFormData.type === "rent"
                      ? "Regular Price ($/Month)"
                      : "Regular Price ($)"
                  }
                  variant="outlined"
                  sx={{ width: { xs: 180, sm: 300, md: 250 } }}
                  color="success"
                  type="number"
                  error={!!errors.regularPrice}
                  helperText={errors.regularPrice?.message}
                />
              )}
            />
            <Controller
              name="discountPrice"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label={
                    nonValidatedFormData.type === "rent"
                      ? "Discount Price ($/Month)"
                      : "Discount Price ($)"
                  }
                  variant="outlined"
                  sx={{ width: { xs: 180, sm: 300, md: 250 } }}
                  color="success"
                  type="number"
                  error={!!errors.discountPrice}
                  helperText={errors.discountPrice?.message}
                />
              )}
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 3 }}
            size="large"
            disabled={loading}
            color="success"
          >
            {loading ? "Loading..." : "SAVE CHANGES"}
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Images:</strong> The first image will be the cover (max 6)
          </Typography>
          {/* <Box sx={{ border: "1px solid grey", p: 2 }}>
            <input
              onChange={(evt) => setFiles(Array.from(evt.target.files))}
              type="file"
              multiple
              accept="image/*"
            />
          </Box> */}
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <input
                style={{ display: "none" }}
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={(evt) => setFiles(evt.target.files)}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  color="success"
                  component="span"
                  fullWidth
                >
                  {files.length > 0
                    ? `${files.length} images selected`
                    : "Choose Images"}
                </Button>
              </label>
            </Grid>
            <Grid item xs={4}>
              <Button
                onClick={handleImageSubmit}
                disabled={uploading}
                startIcon={<CloudUploadIcon />}
                sx={{ textTransform: "none" }}
                type="button"
                variant="outlined"
                fullWidth
                color="success"
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </Grid>
          </Grid>

          {imageUploadError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {imageUploadError}
            </Typography>
          )}
          <Box sx={{ display: "flex", flexWrap: "wrap", mt: 3 }}>
            {nonValidatedFormData.imageUrls.length > 0 &&
              nonValidatedFormData.imageUrls.map((url, index) => (
                <Card
                  key={url}
                  sx={{
                    width: 250,
                    margin: "auto",
                    borderRadius: 1,
                    height: 250,
                    textDecoration: "none",
                    mb: 2,
                    bgcolor: "rgb(241, 245, 241)",
                  }}
                >
                  <Box sx={{ height: "200px" }}>
                    <CardMedia
                      component="img"
                      sx={{ height: 200, objectFit: "cover" }}
                      image={url}
                      alt="property image"
                    />
                  </Box>
                  <CardActions>
                    <Button
                      sx={{ textTransform: "none" }}
                      onClick={() => handleDeleteImage(index)}
                      fullWidth
                      variant="text"
                      color="error"
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
