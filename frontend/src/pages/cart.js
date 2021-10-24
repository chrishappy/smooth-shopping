import * as React from "react"

import { graphql } from "gatsby"
import Seo from "../components/seo"
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import Img from "gatsby-image"
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import { connect } from 'react-redux';
import Stack from '@mui/material/Stack';

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

const CartPage = ({ data, storeDispatch, appState }) => {

  const cartItems = appState.cartItems;

  const products = data.allNodeProduct.edges;
  const productsFiltered = products.filter(({ node: product }) => cartItems.hasOwnProperty(product.id));

  const creditsTotal = appState.user.totalCredits;

  const productTotal = productsFiltered.reduce((runningTotal, {node: product}) => {
    return runningTotal += parseFloat(product.field_credit) * cartItems[product.id].quantity;
  }, 0);

  return (
    <>
      <Seo title="Cart Page" />
      <h1>Your Cart</h1>

      <pre>{JSON.stringify(cartItems, null, 2)}</pre>
      
      <Typography component="div" variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
        { productsFiltered.length } items
      </Typography>

      <hr></hr>

      <Box className="cart-items">
        {productsFiltered.map(({ node: product }) => (
          <Card sx={{ display: 'flex', margin: '1em 0' }} key={product.id}>
            <Box sx={{ width: '100px' }}>
              <Img
                fluid={ product.relationships.field_image.localFile.childImageSharp.fluid }
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: '1' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h6">
                    { product.title }
                  </Typography>
                  {/* <Typography variant="subtitle1" color="text.secondary" component="div">
                    BBD: <strong>{product.field_expired_ ? "After" : "Before"}</strong>
                  </Typography> */}
                </CardContent>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <div>
                    <div><strong>${ product.field_credit }</strong></div>
                    {/* <div>x { cartItems[product.id].quantity }</div> */}
                  </div>
                  <div>
                  <Stack direction="row">
                    <IconButton
                      style={mathButtonStyle}
                      size="small"
                      onClick={() => {
                        storeDispatch({
                          type: 'decrementProduct',
                          product: product,
                        })
                      }}
                      >
                      <RemoveIcon sx={{ fontSize: '16px', }} />
                    </IconButton>
                    <Typography id="modal-product-count" sx={{ mt:1, ml:0.5, mr:0.5 }}>
                      {cartItems[product.id].quantity}
                    </Typography>
                    <IconButton
                      style={mathButtonStyle}
                      size="small"
                      onClick={() => {
                        storeDispatch({
                          type: 'incrementProduct',
                          product: product,
                        })
                      }}
                      >
                      <AddIcon sx={{ fontSize: '16px', }} />
                    </IconButton>
                  </Stack>
                  </div>
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
              <div>${ (creditsTotal - productTotal).toFixed(2) }</div>
          </Box>
        </Typography>

        <Box sx={{ textAlign: 'center' }}>
          <Button variant="contained" sx={{
              padding: '0.5rem 2rem',
              margin: '1rem 0',
              color: '#000',
              backgroundColor: '#75F348',
            }}
            startIcon={<CheckCircleIcon />}>
            Confirm Order
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default connect(state => ({
  appState: state
}), dispatch => ({
  storeDispatch: dispatch
}))(CartPage)

export const query = graphql`
query {
  allNodeProduct {
    edges {
      node {
        id
        title
        field_credit
        field_expired_
        relationships {
          field_image {
            localFile {
              childImageSharp {
                fluid(cropFocus: NORTH, maxWidth: 100, maxHeight: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
}
`;