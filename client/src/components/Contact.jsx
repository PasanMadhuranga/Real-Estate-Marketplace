import axios from "axios";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

 // since we have only the id of the landlord we need to fetch the user (landlord) to display the username and email
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const response = await axios.get(`/api/user/${listing.userRef}`);
        setLandlord(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]); // we need to fetch the landlord whenever the listing changes

  return (
    <>
      {landlord && (
        <>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Contact <strong>{landlord.username}</strong> for '{listing.name}'
          </Typography>
          {/* <Textarea label="message" placeholder="Enter your message..." handleChange={(e) => setMessage(e.target.value)}/> */}

          <TextField
                name="message"
                fullWidth
                // variant="filled"
                multiline
                rows={2}
                onChange={(e) => setMessage(e.target.value)}
              />
          <Button
            component={Link}
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            variant="contained"
            color="info"
            // fullWidth
            sx={{ mt: 1 }}
          >
            Send Message
          </Button>
        </>
      )}
    </>
  );
}
