import {
  Container,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  Button,
  Typography,
  Box,
  Divider,
  RadioGroup,
  Radio,
} from "@mui/material";
import theme from "../themes/theme";
import { ThemeProvider } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Oval } from "react-loader-spinner";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("searchTerm");
    const type = urlParams.get("type");
    const offer = urlParams.get("offer");
    const parking = urlParams.get("parking");
    const furnished = urlParams.get("furnished");
    const sort = urlParams.get("sort");
    const order = urlParams.get("order");
    setSidebarData({
      searchTerm: searchTerm || "",
      type: type || "all",
      offer: offer === "true",
      parking: parking === "true",
      furnished: furnished === "true",
      sort: sort || "createdAt",
      order: order || "desc",
    });
    const fetchListings = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const response = await axios.get(`/api/listing/get?${searchQuery}`);
        console.log(response.data);
        setListings(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchListings();
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    for (const key in sidebarData) {
      urlParams.set(key, sidebarData[key]);
    }
    const searchQuery = urlParams.toString();
    navigate(`/search/?${searchQuery}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: 3 }} maxWidth={false} component="form">
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              bgcolor: "nature.dark",
              p: 3,
              height: { xs: "auto", md: "100vh" },
            }}
          >
            <TextField
              fullWidth
              label="Search Term"
              variant="outlined"
              name="searchTerm"
              onChange={(e) =>
                setSidebarData({ ...sidebarData, searchTerm: e.target.value })
              }
              value={sidebarData.searchTerm}
            />
            <RadioGroup
              aria-labelledby="sell-rent-group"
              name="sell-rent-group"
              row
              sx={{ mt: 1 }}
              onChange={(e) =>
                setSidebarData({ ...sidebarData, type: e.target.value })
              }
              value={sidebarData.type}
            >
              <FormControlLabel
                value="all"
                control={<Radio color="success" />}
                label="Rent & Sale"
              />
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
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={<Checkbox color="success" />}
                label="Offer"
                name="offer"
                onChange={(e) =>
                  setSidebarData({ ...sidebarData, offer: e.target.checked })
                }
                checked={sidebarData.offer}
              />
              <FormControlLabel
                control={<Checkbox color="success" />}
                label="Parking"
                name="parking"
                onChange={(e) =>
                  setSidebarData({ ...sidebarData, parking: e.target.checked })
                }
                checked={sidebarData.parking}
              />
              <FormControlLabel
                control={<Checkbox color="success" />}
                label="Furnished"
                name="furnished"
                onChange={(e) =>
                  setSidebarData({
                    ...sidebarData,
                    furnished: e.target.checked,
                  })
                }
                checked={sidebarData.furnished}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Sort by:
              </Typography>
              <Select
                fullWidth
                variant="outlined"
                color="success"
                name="sort-order"
                onChange={(e) => {
                  const [sort, order] = e.target.value.split("_");
                  setSidebarData({ ...sidebarData, sort, order });
                }}
                value={`${sidebarData.sort}_${sidebarData.order}`}
              >
                <MenuItem value="regularPrice_desc">Price high to low</MenuItem>
                <MenuItem value="regularPrice_asc">Price low to high</MenuItem>
                <MenuItem value="createdAt_desc">Newest</MenuItem>
                <MenuItem value="createdAt_asc">Oldest</MenuItem>
              </Select>
            </Box>
            <Button
              variant="contained"
              color="success"
              sx={{ my: 3 }}
              fullWidth
              onClick={handleSubmit}
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" gutterBottom>
              Listing results:
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {loading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <Oval
                  visible={true}
                  height="80"
                  width="80"
                  color="#4fa94d"
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
