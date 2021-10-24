import * as React from "react"
import { connect } from "react-redux"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { Stack, TextField, Button } from "@mui/material"

import Seo from "../components/seo"


const LoginPage = ({ storeDispatch }) => (
  <>
    <Seo title="login" />
    <Stack
      sx={{
        direction: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        spacing: '3'
      }}
    >
      <StaticImage
        src="../images/hoo_logo2x.jpg"
        // width={300}
        quality={100}
        formats={["auto", "webp", "avif"]}
        alt="House of Omeed"
        style={{ marginBottom: `1.45rem` }}
      />
      <h2>Access code</h2>
      <TextField id="outlined-basic" placeholder="ABC123" variant="outlined" />
      <Button variant="contained" component={Link} to="/home"
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
  </>
)

export default connect(state => ({
  appState: state
}), dispatch => ({
  storeDispatch: dispatch
}))(LoginPage)