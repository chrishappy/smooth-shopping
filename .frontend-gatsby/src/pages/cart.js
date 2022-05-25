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

const CartPage = ({ data, storeDispatch, appState }) => {

  const cartItems = appState.cartItems;

  const products = data.allNodeProduct.edges;
  const productsFiltered = products.filter(({ node: product }) => cartItems.hasOwnProperty(product.id));

  const creditsTotal = appState.user.totalCredits;
  const creditsRemaining = appState.user.creditsRemaining;

  const productTotal = productsFiltered.reduce((runningTotal, {node: product}) => {
    return runningTotal += parseFloat(product.field_credit) * cartItems[product.id].quantity;
  }, 0);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Seo title="Cart Page" />
      <h1>Your Cart</h1>
      
      <Typography component="div" variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
        { productsFiltered.length } items
      </Typography>

      <hr></hr>

      <Box className="cart-items">
        {productsFiltered.map(({ node: product }) => (
          <Card sx={{ display: 'flex', margin: '1em 0' }} key={product.id}>
            <Box sx={{ minWidth: '100px' }}>
              <Img
                fluid={ product.relationships.field_image.localFile.childImageSharp.fluid }
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: '1' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <h4 className="cart-item__title">
                    { product.title }
                  </h4>
                  <Box sx={{ mb:1, fontSize: '15' }}>
                    <div>${ product.field_credit }</div>
                    {/* <div>x { cartItems[product.id].quantity }</div> */}
                  </Box>
                  {/* <Typography variant="subtitle1" color="text.secondary" component="div">
                    BBD: <strong>{product.field_expired_ ? "After" : "Before"}</strong>
                  </Typography> */}
                </CardContent>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
                  <Stack direction="column">
                    <IconButton
                      style={mathButtonStyle}
                      sx={{ height: 28 }}
                      onClick={() => {
                        if (creditsRemaining >= product.field_credit) {
                          storeDispatch({
                            type: 'incrementProduct',
                            product: product,
                          })
                        }
                        else {
                          console.log("not enough credit"); // TODO show a pop-up/ notify in UI
                        }
                      }}
                      >
                      <AddIcon sx={{ fontSize: 12, }} />
                    </IconButton>
                    <Box className="modal-product-count" sx={{ ml:0.5, mr:0.5, fontSize: 15 }}>
                      {cartItems[product.id].quantity}
                    </Box>
                    <IconButton
                      style={mathButtonStyle}
                      sx={{ height: 28 }}
                      onClick={() => {
                        storeDispatch({
                          type: 'decrementProduct',
                          product: product,
                        })
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
            startIcon={<CheckCircleIcon />}
            onClick={() => {
              storeDispatch({
                type: 'CLEAR_CART'
              });
              setOpen(true);
            }}>
            Confirm Order
          </Button>
        </Box>
      </Box>

      

      <Dialog
        open={open}
        onClose={handleClose}
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