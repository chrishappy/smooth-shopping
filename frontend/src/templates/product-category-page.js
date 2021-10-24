import React from "react"
import { graphql } from "gatsby"
import { connect } from "react-redux"
import Img from "gatsby-image"
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
import CheckoutButton from "../components/checkout";

// TODO Abstract it out
const mathButtonStyle = {
  background: 'rgba(255, 255, 255, 0.54)',
  backgroundColor: 'darkGray',
  color: 'black',
  borderRadius: '20px',
  fontWeight: 'bold',
  margin: '0 0.3rem'
}

const ProductCategories = ({ data, appState, storeDispatch }) => {
  const taxonomyTerm = data.taxonomyTermProductCategories;
  const products = data.allNodeProduct.edges;

  const [selectedProduct, setProduct] = React.useState({ title: 'default' });
  const [selectedProductCount, setCount] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setCount(1); // Revert to one
    setOpen(false);
  };

  return (
    <>
      <h1>{ taxonomyTerm.name }</h1>

      <ImageList
        sx={{ margin: '0' }}
        className="product-listings"
        gap="8px">
        {products.map(({ node: product }) => (
          <Box 
            key={product.id}
            onClick={() => {
              setProduct(product);
              setOpen(true);
            }}  className="product-listing">
            <Img fluid={ product.relationships.field_image.localFile.childImageSharp.fluid } />
            <Box className="product-listing__content">
              <h3 className="product-listing__title">{product.title}</h3>
              <Box sx={{ textAlign: 'right', }}>
              {product.field_expired_ ? <WarningAmberIcon sx={{verticalAlign: 'top', color: '#FA9500' }}/> : ''} ${product.field_credit}
              </Box>
            </Box>
          </Box>
        ))}
      </ImageList>

      <CheckoutButton />

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogContent sx={{ minWidth: '25rem' }}>
        <Stack>
          {selectedProduct.hasOwnProperty('relationships') ?
            <Img fluid={ selectedProduct.relationships.field_image.localFile.childImageSharp.fluid }/>
            : <img src="https://source.unsplash.com/random" alt="random item"/>
          }
          <Box sx={{ margin: '0.5rem 0 1rem' }}>
            <Typography id="modal-product-title" variant="h6" component="h2" sx={{ mt: 0.5, fontWeight: 'bold' }}>
              {selectedProduct.title}
            </Typography>
            <Typography id="modal-product-description" sx={{ mb: 1 }}>
              <p>
                {selectedProduct.field_expired_
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
                storeDispatch({
                  type: 'incrementProduct',
                  product: selectedProduct,
                  by: selectedProductCount
                });
                handleClose();
              }}>Add to cart</Button>
          </Box>
        </Stack>
        </DialogContent>
      </Dialog>

      { products.length === 0 ? (<p>There are currently no products.</p>) : ''}
    </>
  )
}

export default connect(state => ({
  appState: state
}), dispatch => ({
  storeDispatch: dispatch
}))(ProductCategories)



export const query = graphql`
  query ($tid: String!) {
    allNodeProduct(
      filter: {relationships: {field_categories: {elemMatch: {id: {eq: $tid}}}}}
    ) {
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
                  fluid(cropFocus: NORTH, maxWidth: 250, maxHeight: 210) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
        }
      }
    }
    taxonomyTermProductCategories(id: {eq: $tid}) {
      id
      name
    }
  }
`;