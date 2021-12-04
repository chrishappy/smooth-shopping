import * as React from "react"
// import { connect } from "react-redux"
// import { Link } from "gatsby"
import Layout from '../components/layout';
import Link from '@mui/material/Link';
// import { StaticImage } from "gatsby-plugin-image"
import { Stack, TextField, Button } from "@mui/material"

// import Seo from "../components/seo"


const LoginPage = ({ storeDispatch }) => (
  
  <Layout>
    {/* <Seo title="login" /> */}
    <Stack
      sx={{
        direction: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        spacing: '3'
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
      <Button variant="contained" component={Link} href="/home"
        sx={{
          backgroundColor: '#75F348',
          color: 'black',
          borderRadius: '20px',
          fontWeight: 'bold',
          padding: '0.3rem 10%'
        }}
        onClick={() => {
          console.log("Login");
          storeDispatch({
            type: 'LOGIN'
          });
        }}
      >
        SUBMIT
      </Button>
    </Stack>
  </Layout>
)

export default LoginPage;
// export default connect(state => ({
//   appState: state
// }), dispatch => ({
//   storeDispatch: dispatch
// }))(LoginPage)