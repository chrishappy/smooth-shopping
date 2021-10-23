import * as React from "react"
import { Link } from "gatsby"
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpIcon from '@mui/icons-material/Help';
import Typography from '@mui/material/Typography';



const toolbarLinkStyle = { //TODO
  color: 'white',
  textDecoration: 'none',
};

const Footer = () => (
  <footer style={{
      backgroundColor: '#00497F',
      padding: '1rem 2rem 0rem 2rem',
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      height: '5rem',
    }}
    class="footer-wrap">
    <Typography component="div" variant="body2">
      <Box sx={{
          flexGrow: 1,
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white'
        }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Link to="/home/" sx={{...toolbarLinkStyle}}>
              <StorefrontIcon />
              <p>Home</p>
            </Link>
          </Grid>
          <Grid item xs={4}>
            <Link to="/account/" sx={{...toolbarLinkStyle}}>
              <AccountCircleIcon />
              <p>Account</p>
            </Link>
          </Grid>
          <Grid item xs={4}>
            <Link to="#" sx={{...toolbarLinkStyle}}>
              <HelpIcon />
              <p>Help</p>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Typography>
  </footer>
)

export default Footer