import React from 'react';
import parse from 'html-react-parser';
import { useQuery } from '@apollo/client';
import ImageList from '@mui/material/ImageList';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CachedIcon from '@mui/icons-material/Cached';

import { GET_PRODUCTS_OF_CATEGORY } from '../../helpers/queries';
import { AddOrderItem, hasNoMoreQuantity, useMaxAndMinQuantitiesForProduct } from '../../helpers/cartItems';
import { hasExistentProperty } from '../../helpers/generic'
import MainContentLoader from '../../components/main-content-loader';
import GoCheckoutButton from '../../components/go-checkout-button';
import './category.css'
import { Link } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Waypoint } from 'react-waypoint';


const CategoryProducts = () => {
  const location = useLocation(); // https://ui.dev/react-router-pass-props-to-link/
  const { title, categoryId } = location.state;

  const { loading, error, data, refetch, fetchMore } = useQuery(GET_PRODUCTS_OF_CATEGORY, {
    variables: { categoryId },
    offset: 0,
  });

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
      <ProductListInfinityScroll
        queryInfo={{loading, error, data, fetchMore}}
        />
    </>
  )
}

export const ProductListInfinityScroll = ({ queryInfo: {loading, error, data, fetchMore}}) => {

  // For Dialog Product
  const [selectedProduct, setProduct] = React.useState({});
  const [isOpen, setOpen] = React.useState(false);

  if (error) {
    console.error(error);
  }

  // Calculate the max and min quantity a user can buy
  const maxAndMinQuantities = useMaxAndMinQuantitiesForProduct(selectedProduct);  
  return (
    <>
      { loading
          ? <MainContentLoader />
          : error 
            ? <p>{error.message}</p>
            : <Products 
                setProduct={setProduct} 
                setOpen={setOpen}
                data={data} />
      }
      <Waypoint
        onEnter={() => {
          console.log('fetching more products')
          if (!error && !loading) {
             // TODO: Prevent fetching more if no more items to fetch?
            fetchMore({
              variables: {
                offset: data.products.length,
                limit: 50, // for GET_ALL_PRODUCTS
              }
            });
          }
        }}
        bottomOffset={'-1000px'} // Load more products when user is near the end
         />
      <GoCheckoutButton />
      <ProductDialog 
        selectedProduct={selectedProduct} 
        reactOpen={[isOpen, setOpen]}
        quantities={maxAndMinQuantities} />
    </>
  );
}

export const Products = ({ setProduct, setOpen, data }) => {
  const { products } = data;

  // If no content
  if (!products || products.length === 0) {
    return (
      'No items at the moment.'
    );
  }

  // Default content
  return (
    <ImageList
      sx={{ margin: '0', padding: '0 0 6em' }}
      className="product-listings links-inherit-color"
      gap={16}>
      {products.map((product) => (
        <Link
          href="#"
          underline="none"
          key={product.id}
          className="product-listing"
          disabled={hasNoMoreQuantity(product) ? true : false}
          tabIndex={hasNoMoreQuantity(product) <= 0.0 ? -1 : null}
          onClick={(e) => {
            e.preventDefault();
            setProduct(product);
            setOpen(true);
          }}>
          <img
            src={product.fieldImage.imageStyleUri.productCategory} 
            alt={product.fieldImage.alt} 
            title={product.fieldImage.title}
            width={product.fieldImage.width}
            height={product.fieldImage.height} />
          <Box className="product-listing__content">
            <h3 className="product-listing__title">{product.title}</h3>
            <Box sx={{ textAlign: 'right', }}>
              {product.fieldExpired ? <WarningAmberIcon sx={{verticalAlign: 'top', color: 'rgb(250 149 0 / 50%)' }}/> : ''} ${product.fieldCredit}
            </Box>
          </Box>
        </Link>
      ))}
    </ImageList>
  );
}

export const ProductDialog = ({reactOpen, quantities, selectedProduct}) => {
  const [minQuantity, maxQuantity] = quantities;
  const [selectedProductCount, setCount] = React.useState(1.0);
  const [isOpen, setOpen] = reactOpen;

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setCount(1.0), 500); // Revert to one
  };

  // If the quantity is zero, set the count to be zero too to deactivate the buttons
  if (maxQuantity === 0.0 && selectedProductCount !== 0.0 && isOpen) {
    setCount(0.0);
  }

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
            <Stack direction="row" sx={{ alignContent: 'center' }}>
              <IconButton
                className="math-button-style"
                onClick={() => {
                  const count = Math.max(selectedProductCount-1, minQuantity);
                  setCount(count);
                }}
                disabled={selectedProductCount === minQuantity}>
                <RemoveIcon sx={{ fontSize: 22 }} />
              </IconButton>
              <Box id="modal-product-count" sx={{ mt: 0.8, ml: 1, mr: 1 }}>
                {selectedProductCount}
              </Box>
              <IconButton
                className="math-button-style"
                onClick={() => {
                  const count = Math.min(selectedProductCount + 1, maxQuantity);
                  setCount(count);
                }}
                disabled={selectedProductCount === maxQuantity}>
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

export default CategoryProducts;