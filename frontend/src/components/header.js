import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Header = ({ siteTitle, cart }) => (
  <header
    style={{
      backgroundColor: `#00497F`
    }}
  >
    <Box sx={{
        flexGrow: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white'
      }}>
      <Grid container spacing={2}>
          <Grid item xs={4}></Grid>
      </Grid>
    </Box>
    <IconButton
      style={{ color: 'white' }}
      aria-label={`back`}>
        <ArrowBackIosNewIcon />
    </IconButton>
    <Link
        to="/cart/"
        style={{
          color: 'white',
          textDecoration: `none`
        }}
      >
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `1.45rem 1.0875rem`,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <ShoppingCartIcon fontSize="large" />
        <h3 style={{ margin: 0, color: `#75F348` }}>
            ${cart.creditsRemaining}
        </h3>
        <div style={{ textAlign: 'center' }}>/{cart.totalCredits}<br/>credits</div>
      </div>
    </Link>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
  cart: PropTypes.object
}

Header.defaultProps = {
  siteTitle: ``,
  cart: { creditsRemaining: -1, totalCredits: 100 }
}

export default Header
