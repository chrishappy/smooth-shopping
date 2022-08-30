import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom";
import CurrentCreditStatus from "./CurrentCreditStatus";
import IconButton from '@mui/material/IconButton';
import CustomSearchIcon from "./SearchIcon";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SystemMessageStatus from "./SystemMessageStatus";
import SystemMessageOrderIds from "./SystemMessageOrderIds";
import { zonedTimeToUtc } from "date-fns-tz";
import { getUnixTime, subDays } from "date-fns";
import { isPickUpOrdersToday } from "../helpers/orderSystemStatus";

const Header = () => {  
  
  const pathname = useLocation().pathname;
  const pathnameTrimmed = pathname.replace(/\/$/, '');
  const isHome = pathnameTrimmed === '';
  const isCart = pathnameTrimmed === '/cart';

  // Order Ids information
  const sevenDaysAgo = zonedTimeToUtc(subDays(new Date(), 7), 'America/Vancouver');
  const sevenDaysAgoTimestamp = getUnixTime(sevenDaysAgo);
  const isPickUpDay = isPickUpOrdersToday();

  const navigate = useNavigate();

  return (
    <>
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
        <div className="header-order-system-info">
          { (isCart || isHome) && <SystemMessageStatus />}
        </div>
      </header>
      { (isHome && isPickUpDay) && <SystemMessageOrderIds sevenDaysAgoTimestamp={sevenDaysAgoTimestamp} />}
  </>)
}

export default Header;