import * as React from "react"
// import { navigate } from "gatsby";
// import { connect } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import CurrentCreditStatus from "./current-credit-status";
import IconButton from '@mui/material/IconButton';
import CustomSearchIcon from "./custom-search-icon";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const Header = () => {
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
      <CustomSearchIcon />
    </div>
  </header>
)
}

export default Header;