import React from "react";
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import QuantityInput from "../components/QuantityInput";
import { useState } from "react";
import {app} from "../firebase";
import {getStorage,ref, uploadBytesResumable,getDownloadURL} from "firebase/storage";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});


export default function CreateListing() {
  const [files, setFiles] = useState([]); //to choose the files
  const [loading , setLoading] = useState(false)
  // const [fileUploadError, setFileUploadError] = useState(false);
  const [formData , setFormData] = useState({
    imageUrls:[]
  });
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  console.log(files);
  console.log("imageupload error:", imageUploadError)
  console.log(formData.imageUrls)
  
  const handleImageSubmit =  (e) => {
    console.log("insidehandlesubmit");
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError("");

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) =>{
        setFormData({...formData, 
          imageUrls: formData.imageUrls.concat(urls)
        })
        setImageUploadError("")
        setUploading(false);

      }).catch((error) => {
        // console.log(error);
        setImageUploadError("Image Upload failed(2 mb max per image)");
        setUploading(false);
      })
    }else{
      console.log("inside else")
      setImageUploadError("You can only upload 6 images");
      setUploading(false);
    }
  }

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on("state_changed", 
        (snapshot) => {
          const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`)
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          }
      )
  });
  });
};
//(_, i) is the callback function used by filter. The underscore _ represents the current element (which we don't need in this case), and i is the index of the current element.
const handleDeleteImage = (index) => {
  const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
  setFormData({ ...formData, imageUrls: newImageUrls });
} 
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
        <Box component="form" sx={{ mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                label="Name"
                variant="filled"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                <strong>Images:</strong> The first image will be the cover (max 6)
              </Typography>
             
                <Box sx={{border:'1px solid grey', p:2}}>
                <input
                  onChange={(evt) => setFiles(evt.target.files)}
                  type="file"
                  multiple
                  accept="image/*"
                />
                </Box>
                <Button onClick={handleImageSubmit} disabled={uploading} startIcon={<CloudUploadIcon />} sx={{textTransform:'none'}} type="button"> {uploading? 'Uploading...' : 'Upload Images'}</Button>
                {imageUploadError && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}> {imageUploadError} </Typography>
                )} 
                 {formData.imageUrls.length > 0 && formData.imageUrls.map((url) => (
                  <Box key={url} sx={{display: 'flex', mb: 1 }}>
                    <img src={url} alt="listing image" width="100" height="100" />
                    <Button sx={{ textTransform: 'none', marginLeft: 1 }} onClick={() => handleDeleteImage(index)}>Delete</Button>
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
                variant="filled"
                inputProps={{ maxLength: 100, minLength: 3 }}
                multiline
                rows={2}
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
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <FormGroup row={true} sx={{ justifyContent: "space-between" }}>
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Sell"
                />
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Rent"
                />
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Parking spot"
                />
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Furnished"
                />
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Offer"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <QuantityInput inputLabel="Beds" min={1} max={10} />
                </Grid>
                <Grid item xs={6} md={3}>
                  <QuantityInput inputLabel="Bathrooms" min={1} max={10} />
                </Grid>
                <Grid item xs={6} md={3}>
                  <QuantityInput
                    inputLabel="Regular Price ($/ Month)"
                    min={1}
                    max={10000}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <QuantityInput
                    inputLabel="Discount Price ($/ Month)"
                    min={1}
                    max={10000}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb:3 }}
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
  )}

