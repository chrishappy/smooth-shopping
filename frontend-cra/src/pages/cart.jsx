import * as React from "react";
import { makeVar, useQuery, useReactiveVar } from '@apollo/client';
import { GET_PRODUCTS_FOR_CART } from "../helpers/queries";
import { cartItemsVar, AddOrderItem, cartTotal } from "../helpers/cache";
import Seo from "../components/seo"

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';

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
  const productTotal = useReactiveVar(cartTotal);

  // For dialogs
  const open = makeVar(false);

  console.log(Object.keys(cartIdsAndQuantities));

  const { loading, error, data } = useQuery(GET_PRODUCTS_FOR_CART, {
    variables: {
      productIds: Object.keys(cartIdsAndQuantities),
    },
  });

  if (error) {
    return (
      'There was an error'
    );
  }

  const totalCredits = loading ? 0 : data.currentUserContext.totalCredits;
  const cartItems = loading ? [] : data.nodeQuery.entities;

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
          <Card sx={{ display: 'flex', margin: '1em 0' }} key={item.productId}>
            <Box sx={{ width: '150px' }}>
              <img
                src={item.fieldImage.derivative.url} 
                alt={item.fieldImage.alt} 
                title={item.fieldImage.title}
                width={item.fieldImage.derivative.width}
                height={item.fieldImage.derivative.height} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: '1' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <h4 className="cart-item__title">
                    { item.title }
                  </h4>
                  <Box sx={{ mb:1, fontSize: '15' }}>
                    <span>${ item.fieldCredit } </span>
                    <span>x { item.quantity }</span>
                  </Box>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    BBD: <strong>{item.fieldExpired ? "After" : "Before"}</strong>
                  </Typography>
                </CardContent>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
                  <Stack direction="column">
                    <IconButton
                      style={mathButtonStyle}
                      sx={{ height: 28 }}
                      onClick={() => {
                        // AddOrderItem(item, 1); // TODO: better to query items from backend and populate cartItems I think...
                        // storeDispatch({
                        //   type: 'incrementProduct',
                        //   product: product,
                        // })
                      }}>
                      <AddIcon sx={{ fontSize: 12, }} />
                    </IconButton>
                    <Box className="modal-product-count" sx={{ ml:0.5, mr:0.5, fontSize: 15 }}>
                      {item.quantity}
                    </Box>
                    <IconButton
                      style={mathButtonStyle}
                      sx={{ height: 28 }}
                      onClick={() => {
                        // storeDispatch({
                        //   type: 'decrementProduct',
                        //   product: product,
                        // })
                      }}>
                      <RemoveIcon sx={{ fontSize: 12, }} />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
      
      <Box className="cart-confirm-order">

        <Typography component="div" color="text.secondary"  variant="body1">
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>Total credits used:</div>
              <div><strong>${ productTotal.toFixed(2) }</strong></div>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>Total credits remaining:</div>
              <div>${ (totalCredits - productTotal).toFixed(2) }</div>
          </Box>
        </Typography>

        <Box sx={{ textAlign: 'center' }}>
          <Button variant="contained" sx={{
              padding: '0.5rem 2rem',
              margin: '1rem 0',
              color: '#000',
              backgroundColor: '#75F348',
            }}
            startIcon={<CheckCircleIcon />}
            onClick={() => {
              // storeDispatch({
              //   type: 'CLEAR_CART'
              // });
              open(true);
            }}>
            Confirm Order
          </Button>
        </Box>
      </Box>

      <Dialog
        open={open()}
        onClose={() => {open(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogContent sx={{ minWidth: '25rem' }}>
          <p>We have received your order.</p>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CartPage;