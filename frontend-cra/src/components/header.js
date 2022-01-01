import * as React from "react"
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
// import { navigate } from "gatsby";
// import { connect } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import CurrentCreditStatus from "./current-credit-status";

const Header = ({ appState }) => {
  const pathname = useLocation().pathname;
  const isHome = pathname.replace(/\/$/, '') === '';

  const navigate = useNavigate();

  return (
  <header
    style={{
      backgroundColor: '#00497F',
      color: 'white',
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
        onClick={() => navigate(-1) } >
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

export default Header;