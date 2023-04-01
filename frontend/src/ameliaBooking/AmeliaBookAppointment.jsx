import React from 'react';
import { useQuery } from "@apollo/client";
import MainContentLoader from "../components/MainContentLoader";
import { Button } from "@mui/material"
import { format, parseISO } from 'date-fns';
import { GET_MOST_RECENT_AMELIA_EVENT } from './queries';
import { getUserUuid } from '../helpers/loginHelper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import { Link } from 'react-router-dom';

const AmeliaBookAppointment = () => {
  const {loading, error, data, refetch} = useQuery(GET_MOST_RECENT_AMELIA_EVENT, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userUuid: getUserUuid(),
    },
  });

  if (error) {
    return (
      'There was an error'
    );
  }
  if (loading) {
    return (
      <MainContentLoader />
    )
  }

  const appointment = data.appointment[0];
  const endDate = parseISO(appointment.endDate);
  const startDate = parseISO(appointment.startDate);
  const now = new Date();

  console.log(appointment);

  const endDateInThePast = endDate < now;

  // TODO: Make sure this actually works
  // const cancelAppointment = () => {
  //   fetch(appointment.cancelUrl.uri)
  //     .then((data) => {
  //       console.log(data);
  //     });
  // }

  const user = data.currentUser;

  console.log(user);

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
      {endDateInThePast ? (
        
        // <iframe src="https://houseofomeed.ca/thegoodchoice-app-appointment-page/"
        <iframe src="https://houseofomeed.ca/testing-thegoodchoice-app-appointment-page/"
        title="Book your appointment with the House of Omeed" 
        width="100%" height="800"
        style={{ border: 'none' }}></iframe>
      ): (
        <>
          <p>Your next appointment at: {format(startDate, 'PPPP p')}</p>

          <p>If you would like to change your appointment, first cancel it by clicking below:</p>

          <p>
              
            <Button variant="contained"
                component={Link}
                target="_blank"
                disabled={true}
                to={{ pathname: appointment.cancelUrl.uri }}>Cancel Appointment</Button>

            <br />
            <a href={appointment.cancelUrl.uri} target="_blank" rel="noreferrer">Cancel Appointment</a>
            {/* <Button
              onClick={cancelAppointment}
              variant="contained">Cancel Appointment</Button> */}
          </p>
        </>
      )}
    </div>
  )
}

export default AmeliaBookAppointment;