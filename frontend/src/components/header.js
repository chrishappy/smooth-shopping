import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';

const Header = ({ cart }) => (
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
        style={{ color: 'white' }}
        aria-label={'back'}>
          <ArrowBackIosNewIcon fontSize="large" />
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
              ${cart.creditsRemaining}
          </h3>
          <div style={{ textAlign: 'center' }}>/{cart.totalCredits}<br/>credits</div>
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

Header.propTypes = {
  cart: PropTypes.object
}

Header.defaultProps = {
  cart: { creditsRemaining: -1, totalCredits: 100 }
}

export default Header
