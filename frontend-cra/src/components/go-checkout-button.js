import * as React from "react"

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { Fab } from "@mui/material";
import { Box } from "@mui/system";
import { useReactiveVar } from "@apollo/client";
import { cartItemsVar } from "../helpers/cartItems";
import { useNavigate } from "react-router-dom";

const GoCheckoutButton = () => {

  const cartItemsReactive = useReactiveVar(cartItemsVar);
  const cartItemsCount = [...cartItemsReactive.values()].reduce((prev, quantity) => prev + quantity, 0.0);

  const navigate = useNavigate();

  const StyledBadge = styled(Badge)(() => ({
    '& .MuiBadge-badge': {
      right: 4,
      top: 5,
      padding: '0 4px',
      backgroundColor: '#eee',
      color: '#000',
      fontWeight: 'bold',
    },
  }));


  return (
    <Box
    sx={{
      position: 'fixed',
      maxWidth: 400,
      left: 0,
      right: 0,
      margin: '0 auto',
      bottom: '5rem',
    }}>
      <Fab color="primary"
          aria-label="Checkout your items"
          sx={{
            color: '#000',
            backgroundColor: '#75F348',
            position: 'absolute',
            bottom: '1.5em',
            right: '1em',
            pointer: 'cursor',
          }}
          variant="extended"
          size="large"
          onClick={() => {
            console.log('TODO: fix navigate');
            navigate('/cart');
          }}>
          <StyledBadge badgeContent={cartItemsCount} color="primary" sx={{ mr: 1 }}>
            <ShoppingCartOutlinedIcon  className="checkout__icon" sx={{ verticalAlign: 'top'}} />
          </StyledBadge>
          Checkout
      </Fab>
    </Box>
    // <Box>
    //   <Button
    //     sx={{ color: '#000', background: '#75F348' }}
    //     aria-label="Checkout your items"
    //     onClick={() => navigate(-1)}>
    //       <Badge badgeContent={cartItems.numberOfProducts} color="primary">
    //         <ShoppingCartOutlinedIcon  className="checkout__icon" sx={{ verticalAlign: 'top'}} />
    //       </Badge>

    //       {/* <ChevronRightIcon className="checkout__icon--right" /> */}
    //   </Button>

    //   <strong className="checkout__text">Checkout</strong>
    // </Box>
  );
}

export default GoCheckoutButton;