
import { gql } from "@apollo/client";

/**
 * Create Query to fetch most recent appointment booking
 */
export const GET_MOST_RECENT_AMELIA_EVENT = gql`
  query MostRecentAmeliaAppointment($userUuid: String!) {
    appointment @jsonapi(path: "node/ss_amelia_appointment?filter[status]=1&sort[sort-end-date][path]=field_ssam_appt_end_date&sort[sort-end-date][direction]=DESC&page[limit]=1") {      
      id
      startDate: fieldSsamApptStartDate
      endDate: fieldSsamApptEndDate
      cancelUrl: fieldSsAmCancelUrl {
        uri
      }
      created
    }

    currentUser(userUuid: $userUuid) @jsonapi(path: "user/user/{args.userUuid}") {      
      id,
      email: mail
      accountHolderFirstName: fieldSsAccountFirstName
      accountHolderLastName: fieldSsAccountLastName
      phone: fieldSsPhone
    }
  }
`;

