import * as React from "react"
import { Link } from "gatsby"
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { navigate } from "gatsby";
import { connect } from "react-redux";

const Header = ({ location, appState }) => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isHome = pathname.replace(/\/$/, '') === '/home';

  return (
  <header
    style={{
      backgroundColor: '#00497F',
      color: 'white',
      marginBottom: '1.45rem'
    }}
    >
    <div style={{
      padding: '1.45rem 1.0875rem',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between' }}>
      <IconButton
        style={{ color: 'white', visibility: isHome ? 'hidden' : undefined }}
        aria-label={'back'}
        onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon fontSize="medium" />
      </IconButton>
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
              ${appState.user.creditsRemaining}
          </h3>
          <div style={{ textAlign: 'center' }}>/{appState.user.totalCredits}<br/>credits</div>
        </div>
      </Link>
      <IconButton
        style={{ color: 'white' }}
        aria-label={'search'}>
          <SearchIcon fontSize="large" />
      </IconButton>
    </div>
  </header>
)
}

export default connect(state => ({
  appState: state
}), null)(Header)
