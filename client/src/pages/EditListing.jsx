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
import { useState ,useEffect} from "react";
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
import { Card, CardMedia, IconButton , CardActions} from '@mui/material';


export default function EditListing() {
  const [files, setFiles] = useState([]); //to choose the files
  const [loading, setLoading] = useState(false);
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
  const params = useParams(); //to get the listing id to load the edit-listing page with respective data

  // const { currentUser } = useSelector((state) => state.user);

  // console.log("formdata", formData);
  console.log("files", files);
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
        setFormData({name, description, address, type, parking, furnished, offer, bedrooms, bathrooms, regularPrice, discountPrice, imageUrls});
      } catch (error) {}
    };
    fetchListing();
  }, []);


//handlesubmit
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const body = {...formData};
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
          <TextField
            name="name"
            required
            fullWidth
            id="name"
            label="Name"
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ my: 1 }}
            color="success"
          />
          <TextField
            name="description"
            required
            fullWidth
            id="description"
            label="Description"
            variant="outlined"
            inputProps={{ minLength: 10 }}
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            sx={{ my: 1 }}
            color="success"
          />
          <TextField
            name="address"
            required
            fullWidth
            id="address"
            label="Address"
            autoFocus
            variant="outlined"
            multiline
            rows={2}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            sx={{ my: 1 }}
            color="success"
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
                    checked={formData.parking}
                    onChange={(e) =>
                      setFormData({ ...formData, parking: e.target.checked })
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
                    checked={formData.furnished}
                    onChange={(e) =>
                      setFormData({ ...formData, furnished: e.target.checked })
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
                      setFormData({ ...formData, offer: e.target.checked })
                    }
                  />
                }
                label="Offer"
              />
            </FormGroup>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <TextField
              label="Bedrooms"
              type="number"
              variant="outlined"
              name="bedrooms"
              id="bedrooms"
              sx={{ width: { xs: 200, sm: 300, md: 250 } }}
              value={formData.bedrooms}
              onChange={(e) =>
                setFormData({ ...formData, bedrooms: e.target.value })
              }
            />
            <TextField
              label="Bathrooms"
              type="number"
              variant="outlined"
              // fullWidth
              sx={{ width: { xs: 200, sm: 300, md: 250 } }}
              name="bathrooms"
              id="bathrooms"
              value={formData.bathrooms}
              onChange={(e) =>
                setFormData({ ...formData, bathrooms: e.target.value })
              }
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <TextField
              label={
                formData.type === "rent"
                  ? "Regular Price ($/Month)"
                  : "Regular Price ($)"
              }
              type="number"
              variant="outlined"
              // fullWidth
              sx={{ width: { xs: 200, sm: 300, md: 250 } }}
              name="regularPrice"
              id="regularPrice"
              value={formData.regularPrice}
              onChange={(e) =>
                setFormData({ ...formData, regularPrice: e.target.value })
              }
            />

            <TextField
              label={
                formData.type === "rent"
                  ? "Discount Price ($/Month)"
                  : "Discount Price ($)"
              }
              type="number"
              variant="outlined"
              sx={{ width: { xs: 200, sm: 300, md: 250 } }}
              name="discountPrice"
              id="discountPrice"
              value={formData.discountPrice}
              onChange={(e) =>
                setFormData({ ...formData, discountPrice: e.target.value })
              }
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
            {loading ? "Loading..." : "EDIT LISTING"}
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
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
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
