import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <AppBar position="static" color='default' elevation={1}  >
            <Toolbar>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" noWrap component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
                        <span>Real</span>
                        <span>Estate</span>
                    </Typography>
                </Box>
                <Box sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 'auto', border:'1px solid ', borderRadius:'10px'}}>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search..."
                        inputProps={{ 'aria-label': 'search' }}
                    />
                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Box>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/about">About</Button>
                <Button color="inherit" component={Link} to="/sign-in">Sign in</Button>
            </Toolbar>
        </AppBar>
    );
}
