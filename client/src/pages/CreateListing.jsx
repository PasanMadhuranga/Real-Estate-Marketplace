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
import { useState, useRef } from "react";
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
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import { ListingNameValidator, ListingDescriptionValidator, ListingPriceValidator, ListingRoomValidator, ListingAddressValidator } from "../components/inputValidators";
import ValidatedTextField from "../components/ValidatedTextField";

export default function CreateListing() {
  const [files, setFiles] = useState([]); //to choose the files
  const [loading, setLoading] = useState(false);
  // const [fileUploadError, setFileUploadError] = useState(false);
  const [nonValidatedformData, setNonValidatedformData] = useState({
    type: "sell",
    parking: false,
    furnished: false,
    offer: false,
    imageUrls: [],
  });

  const isFormValid = useRef({
    name: false,
    description: false,
    address: false,
    bedrooms: false,
    bathrooms: false,
    regularPrice: false,
    discountPrice: false,
  });

  const validatedFormData = useRef({
    name: "",
    description: "",  
    address: "",
    bedrooms: "",
    bathrooms: "",
    regularPrice: "",
    discountPrice: "",
  });

  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  // console.log("files:", files);
  const handleImageSubmit = (e) => {
    if (files.length === 0) {
      setImageUploadError("Please select an image");
    }
    else if (files.length + nonValidatedformData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError("");

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          console.log("set form data")
          setNonValidatedformData({
            ...nonValidatedformData,
            imageUrls: nonValidatedformData.imageUrls.concat(urls),
          }
        );
          console.log("SetFile to null, inside handleImageSubmit before set error")
          setImageUploadError("");
          setUploading(false);
          console.log("SetFile to null, inside handleImageSubmit")
          setFiles([]);/// newly added by pasan
        })
        .catch((error) => {
          // console.log(error);
          setImageUploadError("Image Upload failed(5 mb max per image)");
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
    const imageRef = ref(storage, nonValidatedformData.imageUrls[index]);
    deleteObject(imageRef)
      .then(() => {
        console.log("Image deleted successfully");
        const newImageUrls = nonValidatedformData.imageUrls.filter((_, i) => i !== index);
        setNonValidatedformData({ ...nonValidatedformData, imageUrls: newImageUrls });
      })
      .catch((error) => {
        console.log("Error deleting image", error);
      });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     const body = { ...formData, userRef: currentUser._id };
  //     if (body.imageUrls.length === 0) {
  //       setError("Please upload at least one image");
  //       setLoading(false);
  //       return;
  //     }

  //     if (Number(body.discountPrice) > Number(body.regularPrice)) {
  //       setError("Discount price cannot be greater than regular price");
  //       setLoading(false);
  //       return;
  //     }

  //     const response = await axios.post("/api/listing/create", body, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     setLoading(false);
  //     if (response.success === false) {
  //       setError(response.message);
  //     }
  //     navigate(`/listing/${response.data._id}`); //redirect to the listing page after creating the listing
  //   } catch (error) {
  //     setLoading(false);
  //     setError(error.response.data.message);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const body = { ...validatedFormData.current, userRef: currentUser._id, ...nonValidatedformData };
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

      if (!Object.values(isFormValid.current).every((isValid) => isValid)) { // Check if all form fields are valid
        setError("Invalid form data");
        setLoading(false);
        return;
      }

      const response = await axios.post("/api/listing/create", body, {
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
  }

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Typography component="h1" variant="h3">
          Create a Listing
        </Typography>
      </Box>
      <Grid component="form" onSubmit={handleSubmit} container spacing={3}>
        <Grid item xs={12} md={6} >
          {/* <TextField
            name="name"
            required
            fullWidth
            id="name"
            label="Name"
            variant="outlined"
            value={nonValidatedformData.name}
            onChange={(e) => setNonValidatedformData({ ...nonValidatedformData, name: e.target.value })}
            sx={{ my: 1 }}
            color="success"
          /> */}
          <ValidatedTextField
            label="Name *"
            validator={ListingNameValidator}
            onChangeFunc={(isValid, value) => {
              isFormValid.current.name = isValid;
              validatedFormData.current.name = value;
            }}
            sxProps={{ my: 1 }}
          />
          {/* <TextField
            name="description"
            required
            fullWidth
            id="description"
            label="Description"
            variant="outlined"
            inputProps={{ minLength: 10 }}
            multiline
            rows={3}
            value={nonValidatedformData.description}
            onChange={(e) =>
              setNonValidatedformData({ ...nonValidatedformData, description: e.target.value })
            }
            sx={{ my: 1 }}
            color="success"
          /> */}
          <ValidatedTextField
            label="Description *"
            validator={ListingDescriptionValidator}
            onChangeFunc={(isValid, value) => {
              isFormValid.current.description = isValid;
              validatedFormData.current.description = value;
            }}
            sxProps={{ my: 1 }}
            multiline={true}
            rows={3}
          />
          {/* <TextField
            name="address"
            required
            fullWidth
            id="address"
            label="Address"
            autoFocus
            variant="outlined"
            multiline
            rows={2}
            value={nonValidatedformData.address}
            onChange={(e) =>
              setNonValidatedformData({ ...nonValidatedformData, address: e.target.value })
            }
            sx={{ my: 1 }}
            color="success"
          /> */}
          <ValidatedTextField
            label="Address *"
            validator={ListingAddressValidator}
            onChangeFunc={(isValid, value) => {
              isFormValid.current.address = isValid;
              validatedFormData.current.address = value;
            }}
            sxProps={{ my: 1 }}
            multiline={true}
            rows={2}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <RadioGroup
              row
              aria-labelledby="sell-rent"
              defaultValue="sell"
              name="sell-rent-group"
              value={nonValidatedformData.type}
              onChange={(e) =>
                setNonValidatedformData({ ...nonValidatedformData, type: e.target.value })
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

            <FormGroup row={true} sx={{ justifyContent: "space-between" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="success"
                    name="ParkingSpot"
                    id="ParkingSpot"
                    checked={nonValidatedformData.parking}
                    onChange={(e) =>
                      setNonValidatedformData({ ...nonValidatedformData, parking: e.target.checked })
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
                    checked={nonValidatedformData.furnished}
                    onChange={(e) =>
                      setNonValidatedformData({ ...nonValidatedformData, furnished: e.target.checked })
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
                      setNonValidatedformData({ ...nonValidatedformData, offer: e.target.checked })
                    }
                  />
                }
                label="Offer"
              />
            </FormGroup>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            {/* <TextField
              label="Bedrooms"
              type="number"
              variant="outlined"
              name="bedrooms"
              id="bedrooms"
              sx={{ width: { xs: 200, sm: 300, md: 250 } }}
              value={nonValidatedformData.bedrooms}
              onChange={(e) =>
                setNonValidatedformData({ ...nonValidatedformData, bedrooms: e.target.value })
              }
            /> */}
            <ValidatedTextField
              label="Bedrooms *"
              validator={ListingRoomValidator}
              onChangeFunc={(isValid, value) => {
                isFormValid.current.bedrooms = isValid;
                validatedFormData.current.bedrooms = value;
              }}
              sxProps={{ width: { xs: 180, sm: 300, md: 250 } }}
              type="number"
            />
            {/* <TextField
              label="Bathrooms"
              type="number"
              variant="outlined"
              // fullWidth
              sx={{ width: { xs: 200, sm: 300, md: 250 } }}
              name="bathrooms"
              id="bathrooms"
              value={nonValidatedformData.bathrooms}
              onChange={(e) =>
                setNonValidatedformData({ ...nonValidatedformData, bathrooms: e.target.value })
              }
            /> */}
            <ValidatedTextField
              label="Bathrooms *"
              validator={ListingRoomValidator}
              onChangeFunc={(isValid, value) => {
                isFormValid.current.bathrooms = isValid;
                validatedFormData.current.bathrooms = value;
              }}
              sxProps={{ width: { xs: 180, sm: 300, md: 250 } }}
              type="number"
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            {/* <TextField
              label={
                nonValidatedformData.type === "rent"
                  ? "Regular Price ($/Month)"
                  : "Regular Price ($)"
              }
              type="number"
              variant="outlined"
              // fullWidth
              sx={{ width: { xs: 200, sm: 300, md: 250 } }}
              name="regularPrice"
              id="regularPrice"
              value={nonValidatedformData.regularPrice}
              onChange={(e) =>
                setNonValidatedformData({ ...nonValidatedformData, regularPrice: e.target.value })
              }
            /> */}

            <ValidatedTextField
              label={
                nonValidatedformData.type === "rent"
                  ? "Regular Price ($/Month)"
                  : "Regular Price ($)"
              }
              validator={ListingPriceValidator}
              onChangeFunc={(isValid, value) => {
                isFormValid.current.regularPrice = isValid;
                validatedFormData.current.regularPrice = value;
              }}
              sxProps={{ width: { xs: 180, sm: 300, md: 250 } }}
              type="number"
            />

            {/* <TextField
              label={
                nonValidatedformData.type === "rent"
                  ? "Discount Price ($/Month)"
                  : "Discount Price ($)"
              }
              type="number"
              variant="outlined"
              sx={{ width: { xs: 200, sm: 300, md: 250 } }}
              name="discountPrice"
              id="discountPrice"
              value={nonValidatedformData.discountPrice}
              onChange={(e) =>
                setNonValidatedformData({ ...nonValidatedformData, discountPrice: e.target.value })
              }
            /> */}
            <ValidatedTextField
              label={
                nonValidatedformData.type === "rent"
                  ? "Discount Price ($/Month)"
                  : "Discount Price ($)"
              }
              validator={ListingPriceValidator}
              onChangeFunc={(isValid, value) => {
                isFormValid.current.discountPrice = isValid;
                validatedFormData.current.discountPrice = value;
              }}
              sxProps={{ width: { xs: 180, sm: 300, md: 250 } }}
              type="number"
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
            {loading ? "Loading..." : "CREATE LISTING"}
          </Button>
          {error && (
            <Alert sx={{ mb: 2 }} severity="error">
              {error}
            </Alert>
          )}
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
            {nonValidatedformData.imageUrls.length > 0 &&
              nonValidatedformData.imageUrls.map((url, index) => (
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
                  <CardActions >
                    <Button
                      sx={{ textTransform: "none"}}
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
