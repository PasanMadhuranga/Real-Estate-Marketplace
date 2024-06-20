import { Typography } from "@mui/material";

export default function Logo() {
  return (
    <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
            }}
          >
            RealEstate
          </Typography>
  )
}
