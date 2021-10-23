import * as React from "react"

import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import Img from "gatsby-image"
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';


// import getStore from "../state/createStore"

const CartPage = ({ data }) => {
  // const { store } = getStore();
  // const pids = store.hasOwnProperty("cartItems") ? store.cartItems : {};

  const products = data.allNodeProduct.edges;

  const creditsTotal = 100.0;

  const productTotal = products.reduce((runningTotal, {node: product}) => {
    return runningTotal += parseFloat(product.field_credit);
  }, 0);

  return (
    <Layout>
      <Seo title="Cart Page" />
      <h1>Your Cart</h1>
      {products.map(({ node: product }) => (
        <Card sx={{ display: 'flex', margin: '0 0 1em' }}>
          <Box sx={{ width: '150px' }}>
            <Img
              fluid={ product.relationships.field_image.localFile.childImageSharp.fluid }
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: '1' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h5">
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
                <div class=""></div>
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
    </Layout>
  );
}

export default CartPage

export const query = graphql`
query ($pids: [String] = ["91e294c0-20e1-5e35-b289-20338f139cc7", "0e4c3c90-5dab-5029-b0da-a05fcbe89d59"]) {
  allNodeProduct(filter: {id: {in: $pids}}) {
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
                fluid(cropFocus: NORTH, maxWidth: 150, maxHeight: 150) {
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