import * as React from "react"

import Seo from "../components/seo"
import Typography from '@mui/material/Typography';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';// import CardMedia from '@mui/material/CardMedia';
import { connect } from 'react-redux';

const Account = ({  storeState }) => {

  const userData = storeState.user;
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
    </>
  );
}

export default connect(state => ({
  storeState: state
}), dispatch => ({
  storeDispatch: dispatch
}))(Account)