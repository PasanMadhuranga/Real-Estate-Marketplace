import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link,useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search/?${searchQuery}`);
        // console.log(window)
    }

    //everytime the url chnages, the search box will be updated with the search term
    useEffect(() => {
        //This works because location is a global object in browsers that refers to the current URL.
        // The window object is also global and contains properties like location. When you reference location directly, it is implicitly understood to mean window.location.
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    },[location.search])


    return (
        <AppBar position="static" color='default' elevation={1}  >
            <Toolbar>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" noWrap component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
                        <span>Real</span>
                        <span>Estate</span>
                    </Typography>
                </Box>
                <Box  component='form' onSubmit={handleSubmit} sx={{ p: '2px 4px', display: 'flex' , alignItems: 'center', width: 'auto', border:'1px solid ', borderRadius:'10px'}}>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search..."
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Box>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/about">About</Button>
                {
                    currentUser ? (
                        <Avatar src={currentUser.avatar} alt="profile" sx={{ width: 40, height: 40 }} component={Link} to="/profile"/>
                    ) : (
                        <Button color="inherit" component={Link} to="/sign-in">SIGN IN</Button>
                    )
                }
            </Toolbar>
        </AppBar>
    );
}
