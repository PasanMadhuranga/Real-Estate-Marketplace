import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Logo from "./Logo";

// This button is a styled version of the Button component from Material-UI
const StyledSearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
  marginLeft: 0,
  [theme.breakpoints.up("sm")]: { // the properties in this block will be applied when the screen width is greater than or equal to 'sm' breakpoint
  },
  [theme.breakpoints.up("lg")]: {
    width: "50%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}));

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorElNav, setAnchorElNav] = useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //window.location.search contains the query string part of the current URL (everything after the ?).
    const urlParams = new URLSearchParams(window.location.search);
    //This sets the searchTerm query parameter to the value of the searchTerm variable. If searchTerm already exists, it updates its value; if it doesn't exist, it adds it.
    urlParams.set("searchTerm", searchTerm); //normally we use 'q' for query
    const searchQuery = urlParams.toString();
    navigate(`/search/?${searchQuery}`);
    // console.log(window)
  };

  //everytime the url chnages, the search box will be updated with the search term
  useEffect(() => {
    //This works because location is a global object in browsers that refers to the current URL.
    // The window object is also global and contains properties like location. When you reference location directly, it is implicitly understood to mean window.location.
    const urlParams = new URLSearchParams(location.search); //this contains everything after the '?'
    const searchTermFromUrl = urlParams.get("searchTerm"); //this gets the value of the query parameter 'searchTerm' from urlParams
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl); //this updates the searchterm in the search box
    }
  }, [location.search]);

  return (
    <AppBar position="static" color="success">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "flex", md: "none" } }}> {/* this box will be displayed only on xs and md screens */}
            <IconButton
              size="large"
              aria-label="menu-item"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem component="a" href="/">
                <Typography textAlign="center">Home</Typography>
              </MenuItem>
              <MenuItem component="a" href="/about">
                <Typography textAlign="center">About Us</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
            <Logo />
          </Box>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <StyledSearchButton onClick={handleSubmit} sx={{ ml: 1 }}>
              <SearchIcon style={{ color: "white" }} />
            </StyledSearchButton>
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button href="/" sx={{ my: 2, color: "white", display: "block" }}>
              home
            </Button>
            <Button
              href="/about"
              sx={{ my: 2, color: "white", display: "block" }}
            >
              about us
            </Button>
          </Box>

          <Box sx={{ ml: 3 }}>
            {currentUser ? (
              <IconButton sx={{ p: 0 }} href="/profile">
                <Avatar alt="profile" src={currentUser.avatar} />
              </IconButton>
            ) : (
              <Button
                href="/sign-in"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                sign in
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
