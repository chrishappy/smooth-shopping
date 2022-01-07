import * as React from "react"
import { Link } from "react-router-dom";
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_USER_STATS } from "../helpers/queries";
import { cartTotalVar } from "../helpers/cartItems";

const CurrentCredits = () => {

  const { loading, error, data } = useQuery(GET_USER_STATS);

  let cartTotalReactive = useReactiveVar(cartTotalVar);

  if (error) {
    return (
      'There was an error.'
    );
  }

  let userData;
  if (loading) {
    userData = {
      creditsRemaining: 0.00,
      totalCredits: 0.00,
    };
  }
  else {
    userData = data.currentUserContext;
  }

  const currentCredits = parseFloat(userData.creditsRemaining) - cartTotalReactive;

  return (
    <Link
        to="/cart/"
        style={{
          color: 'white',
          textDecoration: 'none'
        }}
      >
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* <ShoppingCartIcon fontSize="large" /> */}
        <h3 style={{ margin: 0, color: currentCredits >= 0 ? '#75F348' : '#F34848', fontSize: '2rem' }}>
            { // TODO: Make formatting better?
              currentCredits >= 0 
                ? <>${currentCredits}</>
                : <>-${currentCredits * -1}</>
            }
        </h3>
        <div style={{
          textAlign: 'left',
          fontSize: '0.8em',
          lineHeight: 1,
          marginLeft: '0.5em'
        }}>/${parseFloat(userData.totalCredits)}<br/>credits</div>
      </div>
    </Link>
  );
}

export default CurrentCredits;
