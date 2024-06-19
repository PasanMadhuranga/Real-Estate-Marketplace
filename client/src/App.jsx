import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import About from './pages/About'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import EditListing from './pages/EditListing'
import Listing from './pages/Listing'
import Search from './pages/Search'
import Footer from './components/Footer'
import Header from './components/Header'
import { Box, CssBaseline } from '@mui/material'

export default function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <BrowserRouter>
        <Header />
        <Box sx={{ flex: '1 0 auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/listing/:listingId" element={<Listing />} />
            <Route path="/search" element={<Search />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/edit-listing/:listingId" element={<EditListing />} />
            </Route>
          </Routes>
        </Box>
        <Footer />
      </BrowserRouter>
    </Box>
  )
}
