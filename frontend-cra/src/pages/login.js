import * as React from "react"
import { useNavigate } from "react-router-dom";
import { Box, Stack, TextField, Button } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import Seo from "../components/seo"
import { isLoggedIn, loginAsync } from "../helpers/login";
import { snackbarMsgVar, snackbarOpenVar, SnackbarType, snackbarTypeVar } from "../components/snackbar";

const LoginPage = () => {

  const navigate = useNavigate();

  // Form elements
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Loading state
  const [isLoading, setIsLoading] = React.useState(false);
  
  const submitLoginForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (username.length === 0 && password.length === 0) {
      console.log("Can't login: inputs are empty");
    }
    else {
      console.log("Login");
      await loginAsync(username, password)
        .then((loggedInSuccessfully) => {
          if (loggedInSuccessfully) {
            navigate('/');
          }
          else {
            snackbarOpenVar(true);
            snackbarTypeVar(SnackbarType.warning);
            snackbarMsgVar("Your username or password is incorrect.");
            setIsLoading(false);
          }
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
          alt="House of Omeed"
          style={{ marginBottom: `1.45rem` }}
          sx={{ mt: '3rem'}}
        />
        <h2 
          style={{ marginTop: '3rem'}}>Access code</h2>
        <Box
          component="form"
          noValidate>
          <Box
            component="div">
            <TextField 
              id="login__username" 
              variant="filled"
              label="Username"
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
          </Box>
        </Box>
      </Stack>
    </>
  )
}

export default LoginPage;