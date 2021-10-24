import * as React from "react"
import { Link } from "gatsby"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { connect } from "react-redux";

const CurrentCredits = ({ appState }) => {

  const userData = appState.user;

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
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <ShoppingCartIcon fontSize="large" />
        <h3 style={{ margin: 0, color: '#75F348' }}>
            ${userData.creditsRemaining}
        </h3>
        <div style={{ textAlign: 'center' }}>/{userData.totalCredits}<br/>credits</div>
      </div>
    </Link>
  );
}

export default connect(state => ({
  appState: state
}), null)(CurrentCredits)
