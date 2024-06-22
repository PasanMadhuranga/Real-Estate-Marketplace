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
import { useState ,useEffect , useRef} from "react";
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
import { useNavigate,useParams } from "react-router-dom";
import Input from "@mui/material/Input";
import { Alert } from "@mui/material";
import { Card, CardMedia , CardActions} from '@mui/material';
import { ListingNameValidator, ListingDescriptionValidator, ListingPriceValidator, ListingRoomValidator, ListingAddressValidator } from "../components/inputValidators";
import ValidatedTextField from "../components/ValidatedTextField"; 


export default function EditListing() {
  const [files, setFiles] = useState([]); //to choose the files
  const [loading, setLoading] = useState(false);
  // const [formData, setFormData] = useState({
  //   name: "",
  //   description: "",
  //   address: "",
  //   type: "sell",
  //   parking: false,
  //   furnished: false,
  //   offer: false,
  //   bedrooms: 1,
  //   bathrooms: 1,
  //   regularPrice: 0,
  //   discountPrice: 0,
  //   imageUrls: [],
  // });

  const [nonValidatedformData, setNonValidatedformData] = useState({
    type: "sell",
    parking: false,
    furnished: false,
    offer: false,
    imageUrls: [],
  });

  const [isFormValid,setIsFormValid] = useRef({
    name: false,
    description: false,
    address: false,
    bedrooms: false,
    bathrooms: false,
    regularPrice: false,
    discountPrice: false,
  });

  const [validatedFormData,setValidatedFormData] = useState({
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
  const params = useParams(); //to get the listing id to load the edit-listing page with respective data

  // const { currentUser } = useSelector((state) => state.user);

  // console.log("formdata", formData);
  // console.log("files", files);
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
          setNonValidatedformData({
            ...nonValidatedformData,
            imageUrls: nonValidatedformData.imageUrls.concat(urls),
          }
        );
          setImageUploadError("");
          setUploading(false);
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
        setFormData({ ...nonValidatedformData, imageUrls: newImageUrls });
      })
      .catch((error) => {
        setError("Failed to delete image");
      });
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
          console.log(response.error);
          return;
        }
        // console.log("response.data", response.data);
        const {name, description, address, type, parking, furnished, offer, bedrooms, bathrooms, regularPrice, discountPrice, imageUrls} = response.data;
        console.log("response.data", response.data);
        // setFormData({name, description, address, type, parking, furnished, offer, bedrooms, bathrooms, regularPrice, discountPrice, imageUrls});
        setNonValidatedformData({type, parking, furnished, offer, imageUrls});
        // validatedFormData.current = {name, description, address, bedrooms, bathrooms, regularPrice, discountPrice};
        setValidatedFormData({name, description, address, bedrooms, bathrooms, regularPrice, discountPrice});
        console.log("nonValidatedformData", nonValidatedformData);
        console.log("validatedFormData", validatedFormData);
      } catch (error) {}
    };
    fetchListing();
  }, []);


//handlesubmit
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // const body = {...formData};
      const body = {...validatedFormData, ...nonValidatedformData};
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
      <Grid component="form" onSubmit={handleSubmit} container spacing={3}>
        <Grid item xs={12} md={6}>
  
          <ValidatedTextField
            label="Name"
            validator={ListingNameValidator}
            onChangeFunc={(isValid, value) => {
              isFormValid.name = isValid;
              validatedFormData.name = value;
            }}
            sxProps={{ my: 1 }}
          />
          
          <ValidatedTextField
            label="Description"
            validator={ListingDescriptionValidator}
            onChangeFunc={(isValid, value) => {
              isFormValid.description = isValid;
              validatedFormData.description = value;
            }}
            sxProps={{ my: 1 }}
            multiline
            rows={3}
          />
          
          <ValidatedTextField
            label="Address"
            validator={ListingAddressValidator}
            onChangeFunc={(isValid, value) => {
              isFormValid.address = isValid;
              validatedFormData.address = value;
            }}
            sxProps={{ my: 1 }}
            multiline
            rows={2}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <RadioGroup
              row
              aria-labelledby="sell-rent"
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
            
            <ValidatedTextField
              label="Bedrooms"
              validator={ListingRoomValidator}
              onChangeFunc={(isValid, value) => {
                isFormValid.bedrooms = isValid;
                validatedFormData.bedrooms = value;
              }}
              sxProps={{ my: 1 }}
              type="number"
            />
            
            <ValidatedTextField
              label="Bathrooms"
              validator={ListingRoomValidator}
              onChangeFunc={(isValid, value) => {
                isFormValid.bathrooms = isValid;
                validatedFormData.bathrooms = value;
              }}
              sxProps={{ my: 1 }}
              type="number"
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            
            <ValidatedTextField
              label={
                nonValidatedformData.type === "rent"
                  ? "Regular Price ($/Month)"
                  : "Regular Price ($)"
              }
              validator={ListingPriceValidator}
              onChangeFunc={(isValid, value) => {
                isFormValid.regularPrice = isValid;
                validatedFormData.regularPrice = value;
              }}
              sxProps={{ my: 1 }}
              type="number"
            />

            
            <ValidatedTextField
              label={
                nonValidatedformData.type === "rent"
                  ? "Discount Price ($/Month)"
                  : "Discount Price ($)"
              }
              validator={ListingPriceValidator}
              onChangeFunc={(isValid, value) => {
                isFormValid.discountPrice = isValid;
                validatedFormData.discountPrice = value;
              }}
              sxProps={{ my: 1 }}
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
            {loading ? "Loading..." : "SAVE CHANGES"}
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
                {uploading ? "Uploading..." : "Upload Images"}
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
                    width: 220,
                    margin: "auto",
                    borderRadius: 1,
                    height: 220,
                    textDecoration: "none",
                    mb: 2,
                    bgcolor: "rgb(241, 245, 241)",
                  }}
                >
                  <Box sx={{ height: "180px" }}>
                    <CardMedia
                      component="img"
                      sx={{ height: 180, objectFit: "cover" }}
                      image={url}
                      alt="property image"
                    />
                      
                  </Box>
                  <CardActions >
                    <Button
                      sx={{textTransform: "none",alignItems: "center",justifyContent: "center",mt:0,pt:0}}
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
