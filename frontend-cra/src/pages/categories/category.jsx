// TODO Work In Progress

import React from "react"
// import Img from "gatsby-image"
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
// import CheckoutButton from "../../components/checkout";
// import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { useLocation } from 'react-router-dom'
import { GET_PRODUCTS_OF_CATEGORY } from "../../helpers/queries";
import MainContentLoader from "../../components/main-content-loader";

// Import the CSS
import "./category.css"

import { AddOrderItem } from "../../helpers/cache";

// TODO Abstract it out
const mathButtonStyle = {
  background: 'rgba(255, 255, 255, 0.54)',
  backgroundColor: 'darkGray',
  color: 'black',
  borderRadius: '20px',
  fontWeight: 'bold',
  margin: '0 0.3rem'
}

const CategoryProducts = () => {
  const location = useLocation(); // https://ui.dev/react-router-pass-props-to-link/
  const { title } = location.state;

  const [selectedProduct, setProduct] = React.useState({});
  const [selectedProductCount, setCount] = React.useState(1);
  const [isOpen, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    setCount(1); // Revert to one
  };

  return (
    <>
      <h1>{ title }</h1>
      <Products category={title} setProduct={setProduct} setOpen={setOpen}/>
      {/* <CheckoutButton /> */}
      <ProductDialog 
        selectedProduct={selectedProduct} 
        selectedProductCount={selectedProductCount}
        isOpen={isOpen}
        handleClose={handleClose}
        setCount={setCount} />
      {/* { products.length === 0 ? (<p>There are currently no products.</p>) : ''} */}
    </>
  )
}

// export default connect(state => ({
//   appState: state
// }), dispatch => ({
//   storeDispatch: dispatch
// }))(CategoryProducts)

function Products({ category, setProduct, setOpen }) {
  const { loading, error, data } = useQuery(GET_PRODUCTS_OF_CATEGORY, {
    variables: { category },
  });

  if (loading) return (
    <MainContentLoader />
  );

  if (error) {
    console.log(error);
    return <p>{error.message}</p>;
  }

  // If no content
  if (data.nodeQuery.entities.length === 0) {
    return (
      'No items at the moment.'
    );
  }

  // Default content
  return (
    <ImageList
      sx={{ margin: '0' }}
      className="product-listings"
      gap={8}>
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

const ProductDialog = ({isOpen, handleClose, selectedProduct, selectedProductCount, setCount}) => {
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
              <Stack direction="row">
                <IconButton
                  style={mathButtonStyle}
                  onClick={() => {
                    let count = (selectedProductCount-1 < 1) ? 1 : selectedProductCount-1;
                    setCount(count);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography id="modal-product-count" sx={{ mt:1, ml:0.5, mr:0.5 }}>
                  {selectedProductCount}
                </Typography>
                <IconButton
                  style={mathButtonStyle}
                  onClick={() => {
                    setCount(selectedProductCount + 1);
                  }}
                >
                  <AddIcon />
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
                  // storeDispatch({
                  //   type: 'incrementProduct',
                  //   product: selectedProduct,
                  //   by: selectedProductCount
                  // });
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
