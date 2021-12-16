import * as React from "react"
import { Link, useLocation, Navigate } from "react-router-dom";
import { Stack, TextField, Button } from "@mui/material"
import { loggedInVar } from "../cache";

// import Seo from "../components/seo"


const LoginPage = ({ storeDispatch }) => {

  let location = useLocation();
  
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
        <TextField id="outlined-basic" placeholder="ABC123" variant="outlined" sx={{ background: '#fff', mb: '2rem' }}/>
        <Button variant="contained" component={Link} to="/"
          sx={{
            backgroundColor: '#75F348',
            color: 'black',
            borderRadius: '20px',
            fontWeight: 'bold',
            padding: '0.3rem 10%'
          }}
          onClick={() => {
            console.log("Login");
            loggedInVar(true);
          }}
        >
          SUBMIT
        </Button>
      </Stack>
    </>
  )
}

export default LoginPage;