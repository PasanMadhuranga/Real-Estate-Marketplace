import { Button, Grid, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import PropertyCard from "./PropertyCard";


export default function FeaturesSection({
  title,
  listings,
  href,
}) {
  return (
    <>
      <Typography
        variant="h4"
        component="h2"
        color={blueGrey[800]}
        gutterBottom
      >
        {title}
      </Typography>
      <Button variant="text" color="success" href={href} sx={{ mb: 1 }}>
        View All
      </Button>
      <Grid container spacing={3}>
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={4} xl={3} key={listing._id}>
            <PropertyCard listing={listing} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
