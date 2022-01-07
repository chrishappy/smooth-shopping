
import * as React from "react";

import { Button } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import { useMutation } from "@apollo/client";
import { CREATE_AND_UPDATE_ORDER } from "../helpers/queries";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { LoadingButton } from "@mui/lab";

export const CartCheckoutButton = ({disabled, orderData}) => {
  const [createOrder, {data, loading, error}] = useMutation(CREATE_AND_UPDATE_ORDER);

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
        disabled={disabled}
        startIcon={<CheckCircleIcon />}
        onClick={() => {
          setOpen(true);

          createOrder({
            variables: {
              title: orderData.title,
              orderItems: getOrderItemsFormatted(orderData.orderItems),
            }
          });
        }}>
        Confirm Order
      </LoadingButton>

      <Dialog
        open={open && !loading}
        onClose={() => {setOpen(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <DialogContent sx={{ minWidth: '25rem' }}>
          {error 
            ? <p>There was an error. Please contact the House of Omeed</p> // TODO: Abstract?
            : <p>We have received your order.</p> }
        </DialogContent>
      </Dialog>
    </>
  )
}

function getOrderItemsFormatted(orderItems) {
  return orderItems.entries().map(([productId, quantity]) => {
    return {
      productId, 
      quantity
    };
  });
}