import * as React from "react"
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpIcon from '@mui/icons-material/Help';
import { height } from "@mui/system";

const Footer = () => (
  <footer style={{
      backgroundColor: 'gray',
      padding: '1rem 2rem 0rem 2rem',
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '5rem',
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
          <p>Home</p>
        </Grid>
        <Grid item xs={4}>
          <AccountCircleIcon />
          <p>Account</p>
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