import * as React from "react"
import { Link, useLocation, Navigate } from "react-router-dom";
import { Stack, TextField, Button, FormControl  } from "@mui/material"
import { LOCAL_STORAGE_JWT_TOKEN, loggedInVar } from "../cache";
import { gql, useQuery } from "@apollo/client";

// import Seo from "../components/seo"


const LoginPage = ({ storeDispatch }) => {

  let location = useLocation();

  
  const useLogin = () => {
    
    const { loading, error, data } = useQuery(GET_JWT, {
      variables: {
        username: '',
        password: '',
      }
    });

    if (loading) {
      console.log('loading');
      return;
    }

    if (error) {
      console.error('Error');
      return;
    }

    if (data.JwtToken !== null && data.JwtToken !== undefined) {
      localStorage.setItem(LOCAL_STORAGE_JWT_TOKEN, data.JwtToken.jwt)
      console.log("Login");
      loggedInVar(true);
    }
    else {
      console.log("Can't login");
    }
  }
  
  if (loggedInVar()) {
    return (
      <Navigate to="/" state={{ from: location }} />
    );
  }

  return (
    <>
      {/* <Seo title="login" /> */}
      <Stack
        sx={{
          direction: 'column',
          justifyContent: 'center',
          alignItems: 'center',
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
        <TextField 
          id="login__username" 
          variant="outlined"
          label="Username"
          sx={{ background: '#fff', mb: '2rem' }} />
        <TextField 
          id="login__password" 
          type="password"
          variant="outlined" 
          label="Password"
          sx={{ background: '#fff', mb: '2rem' }} />
        <Button variant="contained" component={Link} to="/"
          sx={{
            backgroundColor: '#75F348',
            color: 'black',
            borderRadius: '20px',
            fontWeight: 'bold',
            padding: '0.3rem 10%'
          }}
          onClick={useLogin}
        >
          SUBMIT
        </Button>
      </Stack>
    </>
  )
}



const GET_JWT = gql`
query Login($username:String!, $password:String!) {
  JwtToken(username: $username, password: $password) {
    jwt
  }
}
`;


export default LoginPage;