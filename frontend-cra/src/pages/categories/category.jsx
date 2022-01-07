import React from "react";
import { useLocation } from 'react-router-dom';
import { useQuery, useReactiveVar } from "@apollo/client";
import { GET_PRODUCTS_OF_CATEGORY } from "../../helpers/queries";
import { AddOrderItem, cartItemsVar } from "../../helpers/cartItems";
import MainContentLoader from "../../components/main-content-loader";

import ImageList from '@mui/material/ImageList';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';

import "./category.css"
import GoCheckoutButton from "../../components/go-checkout-button";

const CategoryProducts = () => {
  const location = useLocation(); // https://ui.dev/react-router-pass-props-to-link/
  const { title } = location.state;

  const [selectedProduct, setProduct] = React.useState({});
  const [isOpen, setOpen] = React.useState(false);

  
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS_OF_CATEGORY, {
    variables: { category: title },
  });

  if (error) {
    console.log(error);
  }

  return (
    <>
      <Stack 
        direction="row" 
        sx={{ alignContent: 'center', justifyContent: 'space-between' }}>
        <h1>{ title }</h1>
        <div>
          <IconButton
            color="primary"
            aria-label={'Refresh page'}
            onClick={() => {
              console.log('Clear caches');
              refetch();
            }} >
            <CachedIcon />
          </IconButton>
        </div>
      </Stack>
      { loading 
          ? <MainContentLoader />
          : error 
            ? <p>{error.message}</p>
            : <Products 
                setProduct={setProduct} 
                setOpen={setOpen}
                data={data} />
      }
      <GoCheckoutButton />
      <ProductDialog 
        selectedProduct={selectedProduct} 
        isOpen={isOpen}
        setOpen={setOpen} />
      {/* { products.length === 0 ? (<p>There are currently no products.</p>) : ''} */}
    </>
  )
}

export const Products = ({ setProduct, setOpen, data }) => {

  // If no content
  if (data.nodeQuery.entities.length === 0) {
    return (
      'No items at the moment.'
    );
  }

  // Default content
  return (
    <ImageList
      sx={{ margin: '0', padding: '0 0 6em' }}
      className="product-listings"
      gap={16}>
      {data.nodeQuery.entities.map((product) => (
        <Box
          key={product.entityId}
          className="product-listing"
          onClick={() => {
            setProduct(product);
            setOpen(true);
          }}>
          <img
            src={product.fieldImage.derivative.url} 
            alt={product.fieldImage.alt} 
            title={product.fieldImage.title}
            width={product.fieldImage.derivative.width}
            height={product.fieldImage.derivative.height} />
          <Box className="product-listing__content">
            <h3 className="product-listing__title">{product.entityLabel}</h3>
            <Box sx={{ textAlign: 'right', }}>
            {product.fieldExpired ? <WarningAmberIcon sx={{verticalAlign: 'top', color: 'rgb(250 149 0 / 50%)' }}/> : ''} ${product.fieldCredit}
            </Box>
          </Box>
        </Box>
      ))}
    </ImageList>
  );
}

export const ProductDialog = ({isOpen, setOpen, selectedProduct}) => {

  const productQuantity = parseFloat(useReactiveVar(cartItemsVar).get(selectedProduct.entityId)) || 0.0;
  
  const maxQuantity = parseFloat(selectedProduct.fieldQuantity || 0.0) - productQuantity;
  const minQuantity = Math.min(maxQuantity, 1.0); // In case no more elements (e.g. maxQuantity is zero)

  const [selectedProductCount, setCount] = React.useState(1.0);

  const handleClose = () => {
    setOpen(false);
    setCount(1.0); // Revert to one
  };


  return (
    <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogContent sx={{
          minWidth: '20rem', 
          maxWidth: '97vw', 
          height: '95vh',
        }}>
        <Stack
          className="product-dialog">
          <Box className="product-dialog__img">
          {selectedProduct.hasOwnProperty('fieldImage')
            ? <img 
                src={selectedProduct.fieldImage.url} 
                alt={selectedProduct.fieldImage.alt}
                title={selectedProduct.fieldImage.title} 
                width={selectedProduct.fieldImage.width}
                height={selectedProduct.fieldImage.height} />
            : <img src="https://source.unsplash.com/random" alt="random item"/>}
          </Box>
          <Box className="product-dialog__content">
            <Box sx={{ margin: '0.5rem 0 1rem' }}>
              <Typography id="modal-product-title" variant="h6" component="h2" sx={{ mt: 0.5, fontWeight: 'bold' }}>
                {selectedProduct.entityLabel}
              </Typography>
              <Typography id="modal-product-description" component="p" sx={{ mb: 1 }}>
                {selectedProduct.fieldExpired
                  ? <span><WarningAmberIcon sx={{verticalAlign: 'top', color: '#FA9500' }}/>Expired</span>
                  : <span>Not expired</span>}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Stack direction="row" sx={{ alignContent: 'center' }}>
                <IconButton
                  className="math-button-style"
                  onClick={() => {
                    const count = Math.max(selectedProductCount-1, minQuantity);
                    setCount(count);
                  }}
                  disabled={selectedProductCount === minQuantity}
                >
                  <RemoveIcon sx={{ fontSize: 22 }} />
                </IconButton>
                <Box id="modal-product-count" sx={{ mt: 0.8, ml: 1, mr: 1 }}>
                  { // TODO: Remove hack: how to detect if maxQuantity is zero?
                    maxQuantity === 0.0 
                      ? 0.0 
                      : selectedProductCount
                  }
                </Box>
                <IconButton
                  className="math-button-style"
                  onClick={() => {
                    const count = Math.min(selectedProductCount + 1, maxQuantity);
                    setCount(count);
                  }}
                  disabled={selectedProductCount === maxQuantity}
                >
                  <AddIcon sx={{ fontSize: 22 }} />
                </IconButton>
              </Stack>
              <div style={{marginRight: 'auto'}}></div>
              <Button variant="contained"
                sx={{
                  backgroundColor: '#75F348',
                  color: 'black',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  padding: '0 10%'
                }}
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

export default CategoryProducts;