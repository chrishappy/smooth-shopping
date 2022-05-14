import * as React from "react"
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpIcon from '@mui/icons-material/Help';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';


const toolbarLinkStyle = { //TODO
  color: 'white',
  textDecoration: 'none',
};

const helpButtonStyle = {
  backgroundColor: '#00497F',
  color: 'white',
  borderRadius: '20px',
  fontWeight: 'bold',
  padding: '0.6em 1.5em',
  margin: '0.5em 0',
};

const Footer = () => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
  <footer
    style={{
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      height: '5rem',
      boxSizing: 'content-box',
    }}
    className="footer-wrap mui-fixed">
    <Typography
      component="div"
      variant="body2"
      style={{
        backgroundColor: '#00497F',
        padding: '1rem 2rem 0rem 2rem',
      }}>
      <Box sx={{
          flexGrow: 1,
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white'
        }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Link to="/" sx={{...toolbarLinkStyle}}>
              <StorefrontIcon />
              <p>Home</p>
            </Link>
          </Grid>
          <Grid item xs={4}>
            <Link to="/account" sx={{...toolbarLinkStyle}}>
              <AccountCircleIcon />
              <p>Account</p>
            </Link>
          </Grid>
          <Grid item xs={4}>
            <Link to="#" sx={{...toolbarLinkStyle}} onClick={() => {
              setOpen(true);
            }}>
              <HelpIcon />
              <p>Help</p>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Typography>

    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogContent>
      <Stack sx={{
        direction: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        spacing: '5'
      }}>
        <LiveHelpIcon fontSize="large" />
        <Typography id="modal-product-title" variant="h6" component="h2" sx={{ mb: 1, margin: '1em' }}>
          Need Help?
        </Typography>
        <Button variant="contained"
          href="tel:1-604-565-4464"
          target="_blank"
          style={helpButtonStyle}
          sx={{ mb: 1 }}
          onClick={() => {
            handleClose();
          }}><CallIcon sx={{marginRight: '0.3em'}} />Call (604) 565-4464</Button>
        <Button variant="contained"
          href="mailto:office@houseofomeed.ca"
          target="_blank"
          style={helpButtonStyle}
          onClick={() => {
            handleClose();
          }}><EmailIcon sx={{marginRight: '0.3em'}}/>Send Request</Button>
      </Stack>
      </DialogContent>
    </Dialog>
  </footer>
  )
}

export default Footer