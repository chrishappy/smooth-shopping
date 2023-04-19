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
import PhoneIcon from '@mui/icons-material/Phone';
import "./AmeliaBookAppointment.css";
import { useState } from 'react';

const AmeliaBookAppointment = () => {
  const {loading, error, data, refetch} = useQuery(GET_MOST_RECENT_AMELIA_EVENT, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userUuid: getUserUuid(),
    },
  });

  const [searchParams] = useSearchParams();
  const [processParams, setProcessParams] = useState(false);

  console.log(`Success is ${searchParams.get("success")}`);
  
  if (!processParams && searchParams.get("success") !== null) {
    setProcessParams(true);
    refetch();
  }

  if (error) {
    return (
      'There was an error'
    );
  }

  
  let appointment = {
    endDate: null,
    startDate: null,
  };

  // TODO: Use to autofill the form
  let user = {

  };

  let queryParams = '?'

  if (!loading) {
    console.log(data);

    appointment = data.appointment[0];
    user = data.currentUser;

    console.log(user);

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
  
  console.log(appointment);

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
      {loading ? (
          <MainContentLoader />
        ) : endDateInThePast ? (
              // <iframe src="https://houseofomeed.ca/thegoodchoice-app-appointment-page/"
              <div className="appointment__wrapper">
                <iframe src={`https://houseofomeed.ca/testing-thegoodchoice-app-appointment-page/${queryParams}`}
                  title="Book your appointment with the House of Omeed" 
                  width="100%" height="800"
                  style={{ border: 'none' }}
                  className="appointment__iframe"></iframe>

                <div className="appointment__loader">
                  <MainContentLoader />
                </div>
                
              </div>
            ): (
              <>
                <p>Hi {user.accountHolderFirstName},</p>

                <p>
                  Your next appointment is: <br />
                  <strong>{format(startDate, 'PPPP p')}</strong>
                </p>

                <p> If you have any questions, please call the House of Omeed at:</p>

                <p>
                  <Button variant="contained"
                      target="_blank"
                      color='primary'
                      startIcon={<PhoneIcon />}
                      href={`tel:16045654464`}>604 565 4464</Button>
                </p>

                <p>&nbsp;</p>

                <p>&nbsp;</p>

                <p>To change your appointment, cancel it below then rebook it:</p>

                <p>
                  {/* TODO: Load this in an iframe */}
                  <Button variant="contained"
                      // component={Link}
                      // target="_blank"
                      // disabled={true}
                      color='error'
                      startIcon={<EventBusyIcon />}
                      href={ appointment.cancelUrl.uri }>Cancel Appointment</Button>
                  {/* <a href={appointment.cancelUrl.uri} target="_blank" rel="noreferrer">Cancel Appointment</a> */}
                </p>
              </>
            )}
    </div>
  )
}

export default AmeliaBookAppointment;