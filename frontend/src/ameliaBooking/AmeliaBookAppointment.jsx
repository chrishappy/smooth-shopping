import React from 'react';
import { useQuery } from "@apollo/client";
import { useSearchParams } from "react-router-dom";
import MainContentLoader from "../components/MainContentLoader";
import { Button } from "@mui/material"
import { format, parseISO } from 'date-fns';
import { GET_MOST_RECENT_AMELIA_EVENT } from './queries';
import { getUserUuid } from '../helpers/loginHelper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import "./AmeliaBookAppointment.css";
import { useState } from 'react';
import { SnackbarType, snackbarMsgVar, snackbarOpenVar, snackbarTypeVar } from '../components/Snackbar';

const AmeliaBookAppointment = () => {
  const {loading, error, data, refetch} = useQuery(GET_MOST_RECENT_AMELIA_EVENT, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userUuid: getUserUuid(),
    },
  });

  const [searchParams] = useSearchParams();
  const [processParams, setProcessParams] = useState(false);
  const [cancelEvent, setCancelEvent] = useState(false);

  const resetPage = () => {
    setProcessParams(true);
    setCancelEvent(false);
    refetch();
  }

  const reloadIfSameOrigin = (e) => {
    if (e.target.contentDocument !== null) {
      resetPage();
    }
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

  console.log("Cancel Event is " + JSON.stringify(cancelEvent));

  let appointment = {
    endDate: null,
    startDate: null,
  };

  // TODO: Use to autofill the form
  let user = {
  };

  let queryParams = '?'

  // Handle Apollo data processing
  if (!loading) {
    console.log(data);

    appointment = data.appointment[0];
    user = data.currentUser;

    const queryParamsObj = {
      email: user.email || '',
      'given-name': user.accountHolderFirstName || '',
      'family-name': user.accountHolderLastName || '',
      'tel': Array.isArray(user.phone) && user.phone.length > 0 ? user.phone[0] : '',
    }

    queryParams += new URLSearchParams(queryParamsObj).toString();
  }

  let endDateInThePast = true;
  let startDate = '';

  // Handle end date processing
  if (appointment && appointment.hasOwnProperty('endDate') && appointment.endDate != null) {
    const endDate = parseISO(appointment.endDate);
    startDate = parseISO(appointment.startDate);
    const now = new Date();
  
    endDateInThePast = endDate < now;
  }


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
        
      {(!loading && endDateInThePast) && (
        // <iframe src="https://houseofomeed.ca/thegoodchoice-app-appointment-page/"
        <div className="appointment__wrapper">

          <p>To book your appointment, please choose the day and time you wish to come.</p>

          <p dir="rtl">برای گرفتن نوبت، لطفا تاریخ و ساعت مورد نظر را از اینجا انتخاب کنید.</p>

          <iframe
            src={`https://houseofomeed.ca/testing-appointment-page-thefoodbank-app/${queryParams}`}
            title="Book your appointment with the House of Omeed" 
            width="100%" height="800"
            style={{ border: 'none' }}
            className="appointment__iframe"
            onLoad={reloadIfSameOrigin}></iframe>

          <div className="appointment__loader">
            <MainContentLoader />
          </div>
          
        </div>
      )}
            
      {(!loading && !endDateInThePast && !cancelEvent) && (
        <>
          <p>Hi {user.accountHolderFirstName} {user.accountHolderLastName},</p>

          <p>
            Your next appointment is: <br />
            <strong>{format(startDate, 'PPPP p')}</strong>
          </p>

          {/* <p> If you have any questions, please call the House of Omeed at:</p>

          <p>
            <Button variant="contained"
                target="_blank"
                color='primary'
                startIcon={<PhoneIcon />}
                href={`tel:16045654464`}>604 565 4464</Button>
          </p> */}

          <p>&nbsp;</p>

          <p><hr /></p>

          <p>&nbsp;</p>

          <p>To change your appointment, cancel it below then rebook it:</p>

          <p dir="rtl">
          سلام، 

          </p>

          <p dir="rtl">
          اپوینتمنت شما در بالا ذکر شده. اگر نیاز به تغییر نوبتتان دارید، اول نوبت فعلی را از طریق دکمه زیر کنسل کنید و بعد نوبت بعدی را که تمایل دارید انتخاب کنید.
          </p>

          <p>&nbsp;</p>

          <p>
            <Button variant="contained"
                // component={Link}
                // target="_blank"
                // disabled={true}
                color='error'
                startIcon={<EventBusyIcon />}
                onClick={() => {
                  setCancelEvent(true);
                }}>Cancel Appointment</Button>
            {/* <a href={appointment.cancelUrl.uri} target="_blank" rel="noreferrer">Cancel Appointment</a> */}
          </p>

        </>
      )}
            
      {(!loading && !endDateInThePast && cancelEvent) && (
        <>
          <MainContentLoader />
          <iframe src={appointment.cancelUrl.uri}
            title="Cancel your appointment" 
            width="100%" height="300"
            style={{ border: 'none' }}
            className="appointment__iframe"
            onLoad={reloadIfSameOrigin}></iframe>
        </>
      )}
    </div>
  )
}

export default AmeliaBookAppointment;