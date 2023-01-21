
import * as React from "react";

import { Button } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { useMutation } from "@apollo/client";
import { CREATE_AND_UPDATE_ORDER } from "../helpers/queries";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { LoadingButton } from "@mui/lab";
import { clearApolloCache } from "../helpers/cache";
import { usePastOrderQuantitiesUpdater } from "../helpers/cartHelper";
import { debuggingIsOn } from "../helpers/genericHelper";
import { isOrderingSystemIsOpenToday } from "../helpers/orderSystemStatus";

export const CartCheckoutButton = ({disabledData, orderData}) => {

  const [createOrder, {loading, error}] = useMutation(CREATE_AND_UPDATE_ORDER);
  
  let {isDisabled, notEnoughCredits, noItemsInCart} = disabledData;
  const orderIsOpen = isOrderingSystemIsOpenToday();

  let buttonText = 'Confirm Order';
  if (!orderIsOpen) {
    buttonText = 'Orders Closed Today';
    isDisabled = true;
  }
  else if (noItemsInCart) {
    buttonText = 'No items';
  }
  else if (notEnoughCredits) {
    buttonText = 'Not Enough Credits';
  }

  // For dialogs
  const [open, setOpen] = React.useState(false);

  // Update previous order quanities for limit per product per client
  const pastOrderQuantitiesUpdator = usePastOrderQuantitiesUpdater();
  
  // Create Order Handler
  const createOrderHandlerAsync = async () => {
    setOpen(true);
    
    // TODO: Validate the order server side
    // If the quantities are too great, notify the clients how their
    // order changed
    await createOrder({
      variables: {
        order: {
          title: orderData.title,
          orderItems: getOrderItemsFormatted(orderData.orderItems),
        }
      }
    })
    .then(async () => {
      if (debuggingIsOn()) {
        console.log("Clearing cache");
      }

      return clearApolloCache(true)
        .then(() => pastOrderQuantitiesUpdator());
    })
    .catch((err) => {
      console.error(`Can't clear cache: ${err}`);
      return false;
    });
  };

  // FIXME: See https://github.com/apollographql/apollo-client/issues/9560
  // Once issue is fixed, should just be `loading`.
  const doneLoadingOrError = !loading || error;

  return (
    <>
      <LoadingButton
        loading={!doneLoadingOrError}
        component={Button} 
        variant="contained" 
        sx={{
          padding: '0.5rem 3rem',
          margin: '1rem 0',
          color: '#000',
          backgroundColor: '#75F348',
        }}
        disabled={isDisabled}
        startIcon={!isDisabled ? <CheckCircleIcon /> : <CancelIcon />}
        onClick={createOrderHandlerAsync}>
        {buttonText}
      </LoadingButton>

      <Dialog
        open={open && doneLoadingOrError}
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
