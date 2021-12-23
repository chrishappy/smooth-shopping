import * as React from "react"
import { Link, useLocation, Navigate } from "react-router-dom";
import { Box, Stack, TextField  } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import Seo from "../components/seo"
import { isLoggedIn } from "../helpers/login";

const LoginPage = () => {

  let location = useLocation();

  // Form elements
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Loading state
  const [isLoading, setIsLoading] = React.useState(false);
  
  const submitLoginForm = (e) => {
    // e.preventDefault();
    setIsLoading(true);

    if (username.length > 0 && password.length > 0) {
      console.log("Can't login");
      setIsLoading(false);
      e.preventDefault();
    }
    
    // const { data } = await apolloClient.query({
    //   query: GET_JWT,
    //   variables: {
    //     username,
    //     password,
    //   }
    // });
  
    // console.log(data);
  
    // if (data && data.JwtToken) {
      console.log("Login");
      return true;
    // }
    // else {
    //   console.log("Can't login");
    //   setIsLoading(false);
    //   e.preventDefault();
    // }
  }

  if (isLoggedIn()) {
    return (
      <Navigate to="/" state={{ from: location }} />
    );
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
          <TextField 
            id="login__username" 
            variant="filled"
            label="Username"
            sx={{ background: '#fff', mb: '2rem' }}
            onInput={(e) => setUsername(e.target.value)} />
          <TextField 
            id="login__password" 
            type="password"
            variant="filled" 
            label="Password"
            sx={{ background: '#fff', mb: '2rem' }} 
            onInput={(e) => setPassword(e.target.value)}/>
          <LoadingButton 
            variant="contained" 
            loading={isLoading}
            component={Link}
            to="/"
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
      </Stack>
    </>
  )
}

export default LoginPage;