import * as React from "react"

// import { connect } from 'react-redux';
// import { Link } from "gatsby"
import { Typography, Button } from '@mui/material';
import Seo from "../components/seo"

const Account = ({  appState, storeDispatch }) => {

  const userData = appState.user;
  return (
    <>
      <Seo title="Cart Page" />
      <h1 style={{ textAlign: 'center', marginBottom: '1em' }}>Your Account</h1>

      <h3>{ userData.familyName }</h3>

      <Typography component="div" variant="body1">

      <p>Number of Family Members: {userData.numberOfFamilyMembers}</p>

      <hr></hr>

      <p>
        {/* <MonetizationOnOutlinedIcon sx={{ verticalAlign: 'top' }} />  */}
        <strong> Monthly Plan</strong>: ${userData.totalCredits} <Typography component="span" variant="body2">/month</Typography>
      </p>

      <p>
        {/* <MonetizationOnOutlinedIcon sx={{ verticalAlign: 'top' }} />  */}
        <strong> Current Balance:</strong> ${userData.creditsRemaining} <Typography component="span" variant="body2"> of {userData.totalCredits} credits</Typography>
      </p>
      
      <hr></hr>
      </Typography>

      <Typography component="div" color="text.secondary"  variant="body2">
        Your credits are renewed on the first of every month. Credits do not roll over.
      </Typography>

      <Button variant="contained" to="/"
        sx={{
          backgroundColor: 'gray',
          color: 'black',
          borderRadius: '20px',
          fontWeight: 'bold',
          padding: '0 10%',
          marginTop: '5rem'
        }}
        onClick={() => {
          storeDispatch({
            type: 'LOGOUT'
          });
        }}>Log out</Button>
    </>
  );
}

export default Account;
// export default connect(state => ({
//   appState: state
// }), dispatch => ({
//   storeDispatch: dispatch
// }))(Account)