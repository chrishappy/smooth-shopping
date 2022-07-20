import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom";
import CurrentCreditStatus from "./CurrentCreditStatus";
import IconButton from '@mui/material/IconButton';
import CustomSearchIcon from "./SearchIcon";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { orderingSystemIsOpenToday, orderingSystemMessageForToday } from "../helpers/orderSystemStatus";

const Header = () => {
  const pathname = useLocation().pathname;
  const pathnameTrimmed = pathname.replace(/\/$/, '');
  const isHome = pathnameTrimmed === '';
  const isCart = pathnameTrimmed === '/cart';

  const navigate = useNavigate();

  return (
  <header
    style={{
      backgroundColor: '#00497F',
      color: 'white',
    }}
    >
    <div style={{
      padding: '1rem',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
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
    { (isCart || isHome) &&
      <div className={`header-order-status header-order-status--${orderingSystemIsOpenToday() ? 'open' : 'closed'}`}>
        {orderingSystemMessageForToday()}
      </div>}
  </header>
)
}

export default Header;