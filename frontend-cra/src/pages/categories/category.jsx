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
import { useQuery, gql } from "@apollo/client";
import { useLocation } from 'react-router-dom'

// TODO Abstract it out
const mathButtonStyle = {
  background: 'rgba(255, 255, 255, 0.54)',
  backgroundColor: 'darkGray',
  color: 'black',
  borderRadius: '20px',
  fontWeight: 'bold',
  margin: '0 0.3rem'
}

const ProductCategories = () => {
  const location = useLocation(); // https://ui.dev/react-router-pass-props-to-link/
  const { title } = location.state;
  // const products = data.allNodeProduct.edges; //TODO decide if just call useQuery(PRODUCTS) here...

  const [selectedProduct, setProduct] = React.useState({});
  const [selectedProductCount, setCount] = React.useState(1);
  const [isOpen, setOpen] = React.useState(false);
  const handleClose = () => {
    setCount(1); // Revert to one
    setOpen(false);
  };

  return (
    <>
      <h1>{ title }</h1>
      <Products category={title} setProduct={setProduct} setOpen={setOpen} />
      {/* <CheckoutButton /> */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogContent sx={{ minWidth: '20rem', maxWith: '97vw'}}>
        <Stack>
          {selectedProduct.hasOwnProperty('fieldImage') ?
            <img src={selectedProduct.fieldImage.entity.url} alt="TODO"/>
            : <img src="https://source.unsplash.com/random" alt="random item"/>
          }
          <Box sx={{ margin: '0.5rem 0 1rem' }}>
            <Typography id="modal-product-title" variant="h6" component="h2" sx={{ mt: 0.5, fontWeight: 'bold' }}>
              {selectedProduct.entityLabel}
            </Typography>
            <Typography id="modal-product-description" sx={{ mb: 1 }}>
              <p>
                {selectedProduct.fieldExpired
                  ? <span><WarningAmberIcon sx={{verticalAlign: 'top', color: '#FA9500' }}/>Expired</span>
                  : <span>Not expired</span>}
              </p>
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
                // storeDispatch({
                //   type: 'incrementProduct',
                //   product: selectedProduct,
                //   by: selectedProductCount
                // });
                handleClose();
              }}>Add to cart</Button>
          </Box>
        </Stack>
        </DialogContent>
      </Dialog>
      {/* { products.length === 0 ? (<p>There are currently no products.</p>) : ''} */}
    </>
  )
}

// export default connect(state => ({
//   appState: state
// }), dispatch => ({
//   storeDispatch: dispatch
// }))(ProductCategories)

function Products({ category, setProduct, setOpen }) {
  const { loading, error, data } = useQuery(PRODUCTS, {
    variables: { category },
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>{error.message}</p>;
  }

  // console.log(data.nodeQuery.entities);
  return (
    <ImageList
        sx={{ margin: '0' }}
        className="product-listings"
        gap="8px">
        {data.nodeQuery.entities.map((product) => (
          <Box 
            key={product.entityId}
            className="product-listing"
            onClick={() => {
              setProduct(product);
              setOpen(true);
            }}>
            <img src={ product.fieldImage.entity.url } alt="" />
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

const PRODUCTS = gql`
  # Get the products in a category
  query GetCategoryProducts($category:String) {
    nodeQuery(filter: {
      conditions: [
        {operator: EQUAL, field: "type", value: ["product"]},
        {operator: EQUAL, field: "field_categories.entity.name", value: [$category]},
      ]}
    ) {
      entities {
        entityUuid
        entityId
        entityLabel
        ... on NodeProduct {
          fieldCategories {
            targetId
            entity {
              name
              entityLabel
            }
          }
          fieldCredit
          fieldExpired
          fieldImage {
            entity {
              ... on File {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export default ProductCategories;