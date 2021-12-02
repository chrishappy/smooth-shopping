import * as React from "react"
// import { Link } from "gatsby"
import Link from '@mui/material/Link';
// import { connect } from "react-redux";

const CurrentCredits = ({ appState }) => {

  const userData = appState.user;

  return (
    <Link
        href="/cart/"
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
        <h3 style={{ margin: 0, color: '#75F348', fontSize: '2rem' }}>
            ${userData.creditsRemaining}
        </h3>
        <div style={{
          textAlign: 'left',
          fontSize: '0.8em',
          lineHeight: 1,
          marginLeft: '0.5em'
        }}>/{userData.totalCredits}<br/>credits</div>
      </div>
    </Link>
  );
}

export default CurrentCredits;
// export default connect(state => ({
//   appState: state
// }), null)(CurrentCredits)