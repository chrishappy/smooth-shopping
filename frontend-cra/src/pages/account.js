import * as React from "react"
import { Link } from "react-router-dom";
import { Typography, Button, Box } from '@mui/material';
import Seo from "../components/seo"
import { getUserUuid, logoutCurrentUser } from "../helpers/login";
import { useQuery } from '@apollo/client';
import { GET_USER_STATS } from "../helpers/queries";
import MainContentLoader from "../components/main-content-loader";

const Account = () => {

  const { loading, error, data } = useQuery(GET_USER_STATS, {
    variables: {
      userUuid: getUserUuid(),
    }
  });

  if (error) {
    return (
      'There was an error.'
    );
  }

  if (loading) {
    return (
      <MainContentLoader />
    )
  }

  const userData = data.currentUser;

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

      <Box sx={{ textAlign: 'center' }}>
        <Button variant="outlined" component={Link} to="/"
          color="primary"
          sx={{
            // backgroundColor: 'gray',
            // color: 'black',
            // borderRadius: '20px',
            // fontWeight: 'bold',
            // padding: '0 10%',
            marginTop: '2rem'
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