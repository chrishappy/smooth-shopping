import React from 'react';
import { useQuery } from "@apollo/client";
import { useSearchParams } from "react-router-dom";
import MainContentLoader from "../components/MainContentLoader";
import { GET_MOST_RECENT_AMELIA_EVENT } from './queries';
import { getUserUuid } from '../helpers/loginHelper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import InfoIcon from '@mui/icons-material/Info';
import "./AmeliaBookAppointment.css";
import { useState } from 'react';
import { SnackbarType, snackbarDurationVar, snackbarMsgVar, snackbarOpenVar, snackbarTypeVar } from '../components/Snackbar';

const AmeliaBookAppointment = () => {
  const {loading, error, data, refetch} = useQuery(GET_MOST_RECENT_AMELIA_EVENT, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userUuid: getUserUuid(),
    },
  });
  
  const [searchParams] = useSearchParams();
  const [processParams, setProcessParams] = useState(false);

  const resetPage = () => {
    setProcessParams(true);
    refetch();
  }

  window.addEventListener('message', e => {

    const { data, origin } = e;

    if (origin !== 'https://houseofomeed.ca') {  return;  }

    if (data === 'thefbapp--amelia--cancelled-event') {
      console.log(e);

      snackbarOpenVar(true);
      snackbarTypeVar(SnackbarType.success);
      snackbarMsgVar("Appointment Cancelled");

      resetPage();
    }
  }, false);
  
  if (!processParams && searchParams.get("success") !== null) {
    resetPage();
  }

  if (error) {
    return (
      'There was an error'
    );
  }
  // TODO: Use to autofill the form
  let user = {
  };

  let queryParams = '?'

  // Handle Apollo data processing
  if (!loading) {
    console.log(data);

    user = data.currentUser;

    // Min email is 6 letters: a@a.ca
    if (!(user.email && user.email.length >= 6)) {
      return (
        <div>
          <Stack 
            direction="row" 
            sx={{ alignContent: 'center', justifyContent: 'space-between' }}>
            <h1>Book Your Next Appointment</h1>
            <div>
              <IconButton
                color="primary"
                aria-label={'Refresh page'}
                onClick={() => {
                  refetch();
                }} >
                <CachedIcon />
              </IconButton>
            </div>
          </Stack>

          <p>You can not book appointments because your account does not have an email attached to it.</p>

          <p>Please contact the administration for more details</p>
        </div>
      )
    }

    const queryParamsObj = {
      email: user.email || '',
      'given-name': user.accountHolderFirstName || '',
      'family-name': user.accountHolderLastName || '',
      'tel': Array.isArray(user.phone) && user.phone.length > 0 ? user.phone[0] : '',
    }

    queryParams += new URLSearchParams(queryParamsObj).toString();
  }

  // Check if the appointments have been booked or not:
  const checkIfAppointmentHasBeenBooked = (e) => {
    if (e.target.contentDocument !== null) { // If is of the same origin
      const searchParms = new URLSearchParams(e.target.contentWindow.location.search);
      if (searchParms.get('success') !== null) {
        
        snackbarOpenVar(true);
        snackbarTypeVar(SnackbarType.success);
        snackbarMsgVar("You have booked your appointment.");
        snackbarDurationVar(5000);
        refetch();
      }
    }
  }

  // Different iframes for testing or not
  const bookAppointmentURL = process.env.NODE_ENV === 'development' 
    ? process.env.REACT_APP_TESTING_BOOKING_URL
    : process.env.REACT_APP_PRODUCTION_BOOKING_URL;

  return (
    <div>
      <Stack 
        direction="row" 
        sx={{ alignContent: 'center', justifyContent: 'space-between' }}>
        <h1>Book Your Next Appointment</h1>
        <div>
          <IconButton
            color="primary"
            aria-label={'Refresh page'}
            onClick={() => {
              refetch();
            }} >
            <CachedIcon />
          </IconButton>
        </div>
      </Stack>

      {loading &&  (<MainContentLoader />)}
        
      {!loading && (
        <div>
          <div class="appointment__description">
          
            <p>To book your appointment, please choose the day and time you wish to come.</p>

            <p>Note: <span style={{background: 'red', color: "white"}}>"Maximum Bookings Reached"</span> means you have already booked an appointment in the last 2 weeks.</p>

            <p>Please cancel your current appointment in your emails before trying to book another appointment.</p>

            <p dir="rtl">برای گرفتن نوبت، لطفا تاریخ و ساعت مورد نظر را از اینجا انتخاب کنید.</p>
          </div>
          
          <div className="appointment__wrapper">
            <iframe
              src={`${bookAppointmentURL}/${queryParams}`}
              title="Book your appointment with the House of Omeed" 
              width="100%" height="800"
              style={{ border: 'none', background: "#ddd" }}
              className="appointment__iframe"
              onLoad={checkIfAppointmentHasBeenBooked}></iframe>

            <div className="appointment__loader">
              <MainContentLoader />
            </div>
          </div>
        </div>
        // <iframe src="https://houseofomeed.ca/thegoodchoice-app-appointment-page/"
        
      )}

    </div>
  )
}

export default AmeliaBookAppointment;