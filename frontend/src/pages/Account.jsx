import * as React from "react"
import { Link } from "react-router-dom";
import { Typography, Button, Box } from '@mui/material';
import Seo from "../components/Seo"
import { getUserUuid } from "../helpers/loginHelper";
import LogoutIcon from '@mui/icons-material/Logout';
import { useQuery } from '@apollo/client';
import { GET_USER_STATS } from "../helpers/queries";
import MainContentLoader from "../components/MainContentLoader";
import FormattedAddress from "../components/FormattedAddress";
import FormattedPhoneNumber from "../components/FormattedPhoneNumber";
import { hasExistentProperty } from "../helpers/genericHelper";

const Account = () => {

  const { loading, error, data, refetch } = useQuery(GET_USER_STATS, {
    variables: {
      userUuid: getUserUuid(),
    }
  });

  let userData = {
    familyName: 'ERROR',
    accountHolderFirstName: '',
    accountHolderLastName: '',
    email: '',
    familySize: -1.0,
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

  return (
    <>
      <Seo title="Cart Page" />
      <Box sx={{ textAlign: 'center'}}>

        <h1 style={{ marginBottom: '1em' }}>Your Account</h1>

        <h3>{ userData.familyName }</h3>

        <Typography component="div" variant="body1">

          <p>
            {/* <MonetizationOnOutlinedIcon sx={{ verticalAlign: 'top' }} />  */}
            <strong> Monthly Plan</strong>: ${userData.totalCredits} <Typography component="span" variant="body2">/month</Typography>
          </p>

          <p>
            {/* <MonetizationOnOutlinedIcon sx={{ verticalAlign: 'top' }} />  */}
            <strong> Current Balance:</strong> ${userData.creditsRemaining} 
            <Typography component="span" variant="body2">
              <Button 
                to="#"
                onClick={
                  (e) => {
                    e.preventDefault();
                    return refetch();
                  }
                }>(refresh balance)</Button>
            </Typography>
          </p>

          <Typography component="div" color="text.secondary"  variant="body2" sx={{marginBottom: 4}}>
            Your credits are renewed on the first of every month. Credits do not roll over.
          </Typography>
          
          <hr></hr>

          <h3>Food Pantry Receipt</h3>

          <p><strong>First Name</strong>: {userData.accountHolderFirstName}</p>
          <p><strong>Last Name</strong>: {userData.accountHolderLastName}</p>
          
          <p><strong>Email</strong>: {userData.email}</p>

          { hasExistentProperty(userData, 'familySize')
            ? <p><strong>Family Size</strong>: {userData.familySize} people</p>
            : '' }

          { hasExistentProperty(userData, 'phone') && userData.phone.length > 0
            ? <p><strong>Phone</strong>: <FormattedPhoneNumber phone={userData.phone} /></p>
              : '' }
          { hasExistentProperty(userData, 'address') && hasExistentProperty(userData.address, 'addressLine1')
            ? <p>
                <strong>Address</strong>: <br /> 
                <FormattedAddress address={userData.address} />
              </p>
            : '' }
      
          <hr></hr>

          <Box sx={{ margin: '2rem 0 2rem' }}>
            <Button variant="outlined"
              component={Link}
              to="/logout"
              color="primary"
              endIcon={<LogoutIcon />}>Log out</Button>
          </Box>
        </Typography>
      </Box>
    </>
  );
}

export default Account;