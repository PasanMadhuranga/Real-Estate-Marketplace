import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link,useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import { green } from '@mui/material/colors';

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        //window.location.search contains the query string part of the current URL (everything after the ?).
        const urlParams = new URLSearchParams(window.location.search);
        //This sets the searchTerm query parameter to the value of the searchTerm variable. If searchTerm already exists, it updates its value; if it doesn't exist, it adds it.
        urlParams.set('searchTerm', searchTerm); //normally we use 'q' for query
        const searchQuery = urlParams.toString();
        navigate(`/search/?${searchQuery}`);
        // console.log(window)
    }

    //everytime the url chnages, the search box will be updated with the search term
    useEffect(() => {
        //This works because location is a global object in browsers that refers to the current URL.
        // The window object is also global and contains properties like location. When you reference location directly, it is implicitly understood to mean window.location.
        const urlParams = new URLSearchParams(location.search); //this contains everything after the '?'
        const searchTermFromUrl = urlParams.get('searchTerm'); //this gets the value of the query parameter 'searchTerm' from urlParams
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl); //this updates the searchterm in the search box
        }
    },[location.search])


    return (
        <AppBar color='default' elevation={1} sx={{position: "sticky", top: 0,bgcolor:green[600]}} >
            <Toolbar>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" noWrap component={Link} to="/" sx={{ textDecoration: 'none', color:'white' }}>
                        <span>Real</span>
                        <span>Estate</span>
                    </Typography>
                </Box>
                <Box  component='form' onSubmit={handleSubmit} sx={{ p: '2px 4px', display: 'flex' , alignItems: 'center', width: 'auto', border:'1px  white', mr:5,bgcolor:green[300],opacity:"0.7"}}>
                    <IconButton type="submit" sx={{ p: '10px', color:'white'}} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1,color:'white',opacity:"1.5"}}
                        placeholder="Search..."
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    
                </Box>
                <Button color="inherit" component={Link} to="/" sx={{color:'white',mx:1}}>Home</Button>
                <Button color="inherit" component={Link} to="/about" sx={{color:'white'}}>About</Button>
                {
                    currentUser ? (
                        <Avatar src={currentUser.avatar} alt="profile" sx={{ width: 40, height: 40 ,ml:2}} component={Link} to="/profile"/>
                    ) : (
                        <Button color="inherit" component={Link} to="/sign-in">SIGN IN</Button>
                    )
                }
            </Toolbar>
        </AppBar>
    );
}
