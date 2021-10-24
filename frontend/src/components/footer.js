import * as React from "react"
import { Link } from "gatsby"
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
  padding: '0 10%'
};

const Footer = () => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
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
    className="footer-wrap">
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
        <Typography id="modal-product-title" variant="h6" component="h2" sx={{ mb: 1 }}>
          Need Help?
        </Typography>
        <Button variant="contained"
          style={helpButtonStyle}
          sx={{ mb: 1 }}
          onClick={() => {
            console.log('todo');
            handleClose();
          }}><CallIcon />Call</Button>
        <Button variant="contained"
          style={helpButtonStyle}
          onClick={() => {
            console.log('todo');
            handleClose();
          }}><EmailIcon />Send Request</Button>
      </Stack>
      </DialogContent>
    </Dialog>
  </footer>
  )
}

export default Footer