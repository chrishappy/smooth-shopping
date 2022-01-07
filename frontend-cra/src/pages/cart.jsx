import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_PRODUCTS_FOR_CART } from "../helpers/queries";
import { cartItemsVar, AddOrderItem, cartTotalVar, MinusOrderItem } from "../helpers/cartItems";
import Seo from "../components/seo"

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';
import { CardMedia } from "@mui/material";
import { CartCheckoutButton } from "../components/cart-checkout-button";

const mathButtonStyle = {
  background: 'rgba(255, 255, 255, 0.54)',
  backgroundColor: 'darkGray',
  color: 'black',
  borderRadius: '20px',
  fontWeight: 'bold',
  margin: '0 0.3rem',
};

const CartPage = () => {
  const cartIdsAndQuantities = useReactiveVar(cartItemsVar);
  const cartTotalReactive = useReactiveVar(cartTotalVar);

  const { loading, error, data } = useQuery(GET_PRODUCTS_FOR_CART, {
    variables: {
      productIds: [...cartIdsAndQuantities.keys()],
    },
  });

  if (error) {
    return (
      'There was an error'
    );
  }

  const totalCredits = loading ? 0 : parseFloat(data.currentUserContext.creditsRemaining);
  const cartItems = loading ? [] : data.nodeQuery.entities;
  const userId = loading ? -1 : data.currentUserContext.uid;

  return (
    <>
      <Seo title="Cart Page" />
      <h1>Your Cart</h1>

      <Typography component="div" variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
        { cartItems.length } items
      </Typography>

      <hr />

      <Box className="cart-items">
        {cartItems.map((item) => (
          <Card sx={{ display: 'flex', margin: '1em 0' }} key={item.entityId}>
            <CardMedia
              component="img"
              sx={{ width: '125px', lineHeight: '0' }}
              src={item.fieldImage.derivative.url} 
              alt={item.fieldImage.alt} 
              title={item.fieldImage.title}
              width={item.fieldImage.derivative.width}
              height={item.fieldImage.derivative.height} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: '1' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <h4 className="cart-item__title">
                    { item.title }
                  </h4>
                  <Box sx={{ mb:1, fontSize: '15' }}>
                    <span>${ item.fieldCredit } </span>
                    <span>x { cartIdsAndQuantities.get(item.entityId) }</span> {/* TODO: Find less hacky solution? */}
                  </Box>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    BBD: <strong>{item.fieldExpired ? "After" : "Before"}</strong>
                  </Typography>
                </CardContent>
              </Box>
              {/* TODO: Make this a component along with the one in category */}
              <Box sx={{  display: 'flex', flex: '1 0 auto', textAlign: 'center', maxWidth: '2.1rem', margin: '0 0.7rem' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
                  <Stack direction="column">
                    <IconButton
                      style={mathButtonStyle}
                      sx={{ height: 28 }}
                      onClick={() => {
                        AddOrderItem(item, 1);
                      }}>
                      <AddIcon sx={{ fontSize: 12, }} />
                    </IconButton>
                    <Box className="modal-product-count" sx={{ ml:0.5, mr:0.5, fontSize: 15 }}>
                      <span>{ cartIdsAndQuantities.get(item.entityId) }</span> {/* TODO: Find less hacky solution? */}
                    </Box>
                    <IconButton
                      style={mathButtonStyle}
                      sx={{ height: 28 }}
                      onClick={() => {
                        MinusOrderItem(item, 1);
                      }}>
                      <RemoveIcon sx={{ fontSize: 12, }} />
                    </IconButton>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
      
      <Box className="cart-confirm-order-wrapper mui-fixed">
        <Box className="cart-confirm-order">
          <Typography component="div" color="text.secondary"  variant="body1">
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Total credits used:</div>
                <div><strong>${ cartTotalReactive.toFixed(2) }</strong></div>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Total credits remaining:</div>
                <div>${ (totalCredits - cartTotalReactive).toFixed(2) }</div>
            </Box>
          </Typography>

          <Box sx={{ textAlign: 'center' }}>
            <CartCheckoutButton 
              disabled={cartTotalReactive > totalCredits}
              orderData={{
                uid: userId,
                title: `Sample Order`,
                orderItems: cartIdsAndQuantities,
              }}/>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default CartPage;