import * as React from "react"
import { useNavigate } from "react-router-dom";
import { Box, Stack, TextField, Button } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import Seo from "../components/Seo"
import { isLoggedIn, loginAsync } from "../helpers/loginHelper";
import { snackbarMsgVar, snackbarOpenVar, SnackbarType, snackbarTypeVar } from "../components/Snackbar";
import { usePastOrderQuantitiesUpdater } from "../helpers/cartHelper";
import { debuggingIsOn } from "../helpers/genericHelper";
window.Buffer = window.Buffer || require("buffer").Buffer; 

const LoginPage = () => {

  const navigate = useNavigate();

  // Form elements
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Loading state
  const [isLoading, setIsLoading] = React.useState(false);

  // Load the previous quantity updator
  const previousOrderQuanitiesUpdater = usePastOrderQuantitiesUpdater();
  
  const submitLoginForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (username.length === 0 && password.length === 0) {
      if (debuggingIsOn()) {
        console.error("Can't login: inputs are empty");
      }
    }
    else {
      if (debuggingIsOn()) {
        console.log("Login");
      }
      await loginAsync(username, password)
        .then((loggedInSuccessfully) => {
          if (loggedInSuccessfully) {
            // Must use .then() to avoid navigating while updating the store items
            return previousOrderQuanitiesUpdater()
              .then(() => navigate('/'));
          }
          else {
            snackbarOpenVar(true);
            snackbarTypeVar(SnackbarType.warning);
            snackbarMsgVar("Your username or password is incorrect.");
          }
        })
        .catch((e) => {
          snackbarOpenVar(true);
          snackbarTypeVar(SnackbarType.error);
          snackbarMsgVar("There was an error logging in. Please try again later.");
          console.error(e)
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    
  }

  if (isLoggedIn()) {
    navigate('/');
  }

  return (
    <>
      <Seo title="Login" />
      <Stack
        sx={{
          direction: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          spacing: '3',
        }}
      >
        <img
          src={process.env.PUBLIC_URL + '/images/hoo_logo2x.jpg'}
          // width={300}
          quality={100}
          formats={["auto", "webp", "avif"]}
          alt="The House of Omeed Logo"
          sx={{ mt: '3rem', mb: `1.5rem` }}
        />
        <h2 
          style={{ marginTop: '3rem'}}>Food Distribution Login</h2>
        <Box
          component="form"
          noValidate>

          <Box sx={{ lineHeight: '1.3', padding: '1rem', background: 'green', borderRadius: '0.5rem', margin: '0 0 2rem' }}>
            Note: The New System will Open on <strong>Monday, May 29th at 3 pm</strong>. <br /><br />
            We will send you an email at 3 pm with your username and password. <br /><br />
            If you have already received an email, please use the password in the new email.
          </Box>

          {/* <Box
            component="div">
            <TextField 
              id="login__username" 
              variant="filled"
              label="Username"
              disabled={true}
              sx={{ background: '#fff', mb: '2rem' }}
              onInput={(e) => setUsername(e.target.value)} />
          </Box>
          <Box
            component="div">
            <TextField 
              id="login__password" 
              type="password"
              variant="filled" 
              label="Password"
              disabled={true}
              sx={{ background: '#fff', mb: '2rem' }} 
              onInput={(e) => setPassword(e.target.value)}/>
          </Box>
          <Box
            component="div">
            <LoadingButton
              type="submit"
              variant="contained" 
              loading={isLoading}
              component={Button}
              disabled={true}
              className="login__loading-button"
              sx={{
                backgroundColor: '#75F348',
                color: 'black',
                borderRadius: '20px',
                fontWeight: 'bold',
                padding: '0.3rem 10%'
              }}
              onClick={submitLoginForm}
            >
              SUBMIT
            </LoadingButton>
          </Box> */}
          <Box sx={{ marginTop: '3rem', fontSize: '0.8em', lineHeight: '1.3', fontStyle: 'italic' }}>
            If you have any questions, please call&nbsp;
            <strong>
              <a href="tel:16045654464" target="_blank" rel="noreferrer" style={{ color: '#fff' }}>604 565 4464</a>
            </strong>.
          </Box>
        </Box>
      </Stack>
    </>
  )
}

export default LoginPage;