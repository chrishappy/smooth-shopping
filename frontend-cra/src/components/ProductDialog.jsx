import React from 'react';
import parse from 'html-react-parser';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { AddOrderItem } from '../helpers/cartHelper';
import { hasExistentProperty } from '../helpers/genericHelper'
import ProductAddRemoveButtons from './ProductAddRemoveButtons';

import './product-dialog.css';


export const ProductDialog = ({reactOpen, selectedProduct}) => {
  const [selectedProductCount, setCount] = React.useState(1.0);
  const [isOpen, setOpen] = reactOpen;

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setCount(1.0), 500); // Revert to one
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <DialogContent sx={{
        minWidth: '20rem', 
        maxWidth: '97vw', 
        height: '95vh',
      }}>
      <Stack
        className="product-dialog">
        <Box className="product-dialog__img">
        {hasExistentProperty(selectedProduct,  'fieldImage')
          ? <img
              src={selectedProduct.fieldImage.imageStyleUri.popupLargeImage}
              alt={selectedProduct.fieldImage.alt}
              title={selectedProduct.fieldImage.title}
              width={selectedProduct.fieldImage.width}
              height={selectedProduct.fieldImage.height} />
          : <img src="https://source.unsplash.com/random" alt="random item"/>}
        </Box>
        <Box className="product-dialog__content">
          <Box sx={{ margin: '0.5rem 0 1rem' }}>
            <Typography id="modal-product-title" variant="h6" component="h2" sx={{ mt: 0.5, fontWeight: 'bold' }}>
              {selectedProduct.title}
            </Typography>
            <Typography id="modal-product-description" component="p" sx={{ mb: 1 }}>
              {selectedProduct.fieldExpired
                ? <span><WarningAmberIcon sx={{verticalAlign: 'top', color: '#FA9500' }}/>Expired</span>
                : <span>Not expired</span>}
            </Typography>
            {hasExistentProperty(selectedProduct, 'body') ? parse(selectedProduct.body.processed) : null}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ProductAddRemoveButtons
              selectedProduct={selectedProduct}
              currentQuantity={selectedProductCount}
              direction="row"
              iconFontSize={22}
              onAddOrderItemClick={(maxQuantity) => {
                const count = Math.min(selectedProductCount+1, maxQuantity);
                setCount(count);
              }}
              onMinusOrderItemClick={(minQuantity) => {
                const count = Math.max(selectedProductCount-1, minQuantity);
                setCount(count);
              }}
              enableMinQuantityCheck={true} />
            <div style={{marginRight: 'auto'}}></div>
            <Button variant="contained"
              sx={{
                backgroundColor: '#75F348',
                color: 'black',
                borderRadius: '20px',
                fontWeight: 'bold',
                padding: '0 10%'
              }}
              disabled={selectedProductCount === 0.0}
              onClick={() => {                 
                AddOrderItem(selectedProduct, selectedProductCount);
                handleClose();
              }}>
              Add to cart
            </Button>
          </Box>
        </Box>
      </Stack>
      </DialogContent>
    </Dialog>
  )
}