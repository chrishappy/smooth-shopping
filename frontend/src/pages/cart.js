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


const CartPage = ({ data, appState }) => {

  const cartItems = appState.cartItems;

  const products = data.allNodeProduct.edges;
  const productsFiltered = products.filter(({ node: product }) => cartItems.hasOwnProperty(product.id));

  const creditsTotal = 100.0;

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
                <Typography variant="subtitle1" color="text.secondary" component="div">
                  BBD: <strong>{product.field_expired_ ? "After" : "Before"}</strong>
                </Typography>
              </CardContent>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <div><strong>${ product.field_credit }</strong></div>
                <p>x { cartItems[product.id].quantity }</p>
              </CardContent>
            </Box>
          </Box>
        </Card>
      ))}
      
      <hr></hr>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="div" variant="body1">
          Total credits used:
        </Typography>
        <Typography component="div" variant="body1">
          <strong>${ productTotal.toFixed(2) }</strong>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="div" color="text.secondary"  variant="body1">
          Total credits remaining:
        </Typography>
        <Typography component="div" color="text.secondary"  variant="body1">
          ${ (creditsTotal - productTotal).toFixed(2) }
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Button variant="contained" sx={{ padding: '0.5rem 2rem', fontWeight: 'bold', margin: '2rem 0'}}>
          Checkout
        </Button>
      </Box>
    </>
  );
}

export default connect(state => ({
  appState: state
}), null)(CartPage)

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