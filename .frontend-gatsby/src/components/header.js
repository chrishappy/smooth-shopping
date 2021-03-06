import * as React from "react"
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
import { navigate } from "gatsby";
import { connect } from "react-redux";
import CurrentCreditStatus from "./current-credit-status";

const Header = ({ appState }) => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isHome = pathname.replace(/\/$/, '') === '';

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
      <CurrentCreditStatus />
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
