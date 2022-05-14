import * as React from "react"
import { Link } from "react-router-dom";
import { Typography, Button, Box } from '@mui/material';
import Seo from "../components/Seo"
import { getUserUuid, logoutCurrentUser } from "../helpers/loginHelper";
import { useQuery } from '@apollo/client';
import { GET_USER_STATS } from "../helpers/queries";
import MainContentLoader from "../components/MainContentLoader";
import FormattedAddress from "../components/FormattedAddress";
import FormattedPhoneNumber from "../components/FormattedPhoneNumber";

const Account = () => {

  const { loading, error, data } = useQuery(GET_USER_STATS, {
    variables: {
      userUuid: getUserUuid(),
    }
  });

  let userData = {
    familyName: 'ERROR',
    numberOfFamilyMembers: -1.0,
    totalCredits: -1.0,
    creditsRemaining: -1.0,
    phone: '',
    address: {
      province: '',
      city: '',
      postalCode: '',
      addressLine1: '',
      addressLine2: '',
    }
  };

  if (loading) {
    return (
      <MainContentLoader />
    )
  }

  if (!error) {
    userData = data.currentUser;
  }

  console.log(userData);

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

      <Typography component="div" color="text.secondary"  variant="body2" sx={{marginBottom: 4}}>
        Your credits are renewed on the first of every month. Credits do not roll over.
      </Typography>

      </Typography>
      
      <hr></hr>

      { userData.phone.length > 0
        ? <p>
            <strong>Phone</strong>: <FormattedPhoneNumber phone={userData.phone} />
          </p> : '' }
      { userData.address.addressLine1.length > 0
        ? <p>
            <strong>Address</strong>: <br /> 
            <FormattedAddress address={userData.address} />
          </p>
        : '' }

      <Box sx={{ textAlign: 'center' }}>
        <Button variant="outlined" component={Link} to="/"
          color="primary"
          sx={{
            // backgroundColor: 'gray',
            // color: 'black',
            // borderRadius: '20px',
            // fontWeight: 'bold',
            // padding: '0 10%',
            margin: '0 0 2rem'
          }}
          onClick={() => {
            logoutCurrentUser();
          }}>Log out</Button>
      </Box>
    </>
  );
}

export default Account;
// export default connect(state => ({
//   appState: state
// }), dispatch => ({
//   storeDispatch: dispatch
// }))(Account)