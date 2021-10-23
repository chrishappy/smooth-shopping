import * as React from "react"
import { Link } from "gatsby"
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpIcon from '@mui/icons-material/Help';

const toolbarLinkStyle = { //TODO
  color: 'white',
  textDecoration: 'none',
};

const Footer = () => (
  <footer style={{
      backgroundColor: 'gray',
      padding: '1rem 2rem 0rem 2rem',
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '100%'
    }}>
    <Box sx={{
        flexGrow: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white'
      }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <StorefrontIcon />
          <Link to="/home/" sx={{...toolbarLinkStyle}}><p>Home</p></Link>
        </Grid>
        <Grid item xs={4}>
          <AccountCircleIcon />
          <Link to="/account/" sx={{...toolbarLinkStyle}}><p>Account</p></Link>
        </Grid>
        <Grid item xs={4}>
          <HelpIcon />
          <p>Help</p>
        </Grid>
      </Grid>
    </Box>
  </footer>
)

export default Footer