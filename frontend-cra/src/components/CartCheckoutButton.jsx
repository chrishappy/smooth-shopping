
import * as React from "react";

import { Button } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { useMutation } from "@apollo/client";
import { CREATE_AND_UPDATE_ORDER } from "../helpers/queries";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { LoadingButton } from "@mui/lab";
import { apolloClient, clearApolloCache } from "../helpers/cache";

export const CartCheckoutButton = ({disabledData, orderData}) => {
  // TODO: Display old orders somewhere
  const [createOrder, {loading, error}] = useMutation(CREATE_AND_UPDATE_ORDER);
  const {isDisabled, notEnoughCredits, noItemsInCart} = disabledData;

  let buttonText = 'Confirm Order';
  if (noItemsInCart) {
    buttonText = 'No items';
  }
  else if (notEnoughCredits) {
    buttonText = 'Not Enough Credits';
  }

  // For dialogs
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <LoadingButton
        loading={loading}
        component={Button} 
        variant="contained" 
        sx={{
          padding: '0.5rem 2rem',
          margin: '1rem 0',
          color: '#000',
          backgroundColor: '#75F348',
        }}
        disabled={isDisabled}
        startIcon={!isDisabled ? <CheckCircleIcon /> : <CancelIcon />}
        onClick={() => {
          setOpen(true);
          
          // TODO: Validate the order before submitting
          // Create a new function in cartHelper
          // 1. use the promise in usePreviousOrderQuantitiesUpdater(), then
          // 2. loop over all the products in the cart and check that the quantity
          //      that is not greater than the maximum
          // 3. if it is, make the color red and disable the button

          createOrder({
            variables: {
              order: {
                title: orderData.title,
                orderItems: getOrderItemsFormatted(orderData.orderItems),
              }
            }
          }).then(() => {
            console.log("Clearing cache");
            // https://www.apollographql.com/docs/react/data/refetching/
            clearApolloCache();
            apolloClient.refetchQueries({
              include: 'all',
            });
          });
        }}>
        {buttonText}
      </LoadingButton>

      <Dialog
        open={open && !loading}
        onClose={() => {setOpen(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <DialogContent sx={{ minWidth: '25rem', maxWidth: '90vw' }}>
          {error 
            ? <p>There was an error. Please contact the House of Omeed</p> // TODO: Abstract?
            : <p>We have received your order.</p> }
        </DialogContent>
      </Dialog>
    </>
  )
}

function getOrderItemsFormatted(orderItems) {
  console.log([...orderItems.entries()]);
  return [...orderItems.entries()].map(([productId, quantity]) => {
    return {
      productId: parseInt(productId), 
      quantity: parseFloat(quantity),
    };
  });
}
