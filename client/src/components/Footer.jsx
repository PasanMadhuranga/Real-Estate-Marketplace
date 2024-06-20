import React from "react";
import Container from "@mui/material/Container";
import { Grid, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { green } from "@mui/material/colors";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const styles = {
    footer: {
      padding: "24px 0",
      borderTop: "1px solid #e0e0e0",
      backgroundColor: green[700],
      color: "white",
      // marginTop: "auto",
      //       position:"fixed",
      // bottom:0
    },
  };

  return (
    <footer style={styles.footer}>
      <Container color="success" maxWidth="lg">
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: { xs: "flex", md: "block" },
                justifyContent: { xs: "center", md: "start" },
              }}
            >
              <Logo />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" sx={{ mb: 1, opacity: "0.7" }}>
                Copyright &copy;
                {currentYear}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                All rights reserved
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "end" },
            }}
          >
            <Box>
              <IconButton color="inherit" href="#">
                <GitHubIcon />
              </IconButton>
              <IconButton color="inherit" href="#">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" href="#">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
