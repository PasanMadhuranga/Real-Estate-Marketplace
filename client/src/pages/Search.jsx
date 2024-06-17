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
} from "@mui/material";
import theme from "../themes/theme";
import { ThemeProvider } from "@mui/material";

export default function Search() {
  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: 3 }} maxWidth={false}>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              bgcolor: "nature.dark",
              pr: 3,
              height: { xs: "auto", md: "100vh" },
            }}
          >
            <TextField fullWidth label="Search Term" variant="outlined" />
            <Box sx={{ mt: 2 }}>
              <FormControlLabel control={<Checkbox color="success" />} label="Rent & Sale" />
              <FormControlLabel control={<Checkbox color="success" />} label="Rent" />
              <FormControlLabel control={<Checkbox color="success" />} label="Sale" />
              <FormControlLabel control={<Checkbox color="success" />} label="Offer" />
            </Box>
            <Box sx={{ mt: 2 }}>
              <FormControlLabel control={<Checkbox color="success" />} label="Parking" />
              <FormControlLabel control={<Checkbox color="success" />} label="Furnished" />
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Sort by:
                </Typography>
              <Select
                fullWidth
                defaultValue="Price high to low"
                variant="outlined"
              >
                <MenuItem value="Price high to low">Price high to low</MenuItem>
                <MenuItem value="Price low to high">Price low to high</MenuItem>
                <MenuItem value="Newest">Newest</MenuItem>
                <MenuItem value="Oldest">Oldest</MenuItem>
              </Select>
            </Box>
            <Button
              variant="contained"
              color="success"
              sx={{my: 3}}
              fullWidth
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" gutterBottom>
              Listing results:
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
