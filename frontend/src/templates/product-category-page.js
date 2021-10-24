import React from "react"
import { graphql } from "gatsby"
import { connect } from "react-redux"
import Img from "gatsby-image"
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// TODO Abstract it out
const mathButtonStyle = {
  background: 'rgba(255, 255, 255, 0.54)',
  backgroundColor: 'darkGray',
  color: 'black',
  borderRadius: '20px',
  fontWeight: 'bold',
  margin: '0 0.3rem'
}

const ProductCategories = ({ data, storeDispatch }) => {
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
      <div>
        <h1>{ taxonomyTerm.name }</h1>

        <ImageList
          sx={{ margin: '0' }}
          className="product-list">
          {products.map(({ node: product }) => (
            <ImageListItem key={product.id} onClick={() => {
              setProduct(product);
              setOpen(true);
            }}>
              <Img fluid={ product.relationships.field_image.localFile.childImageSharp.fluid } />
              <ImageListItemBar
                title={product.title}
                // subtitle={product.field_expired_ ? <span>BBD: <strong>After</strong></span> : <span>BBD: <strong>Before</strong></span>}
                subtitle={`$${product.field_credit}`}
                position="below"
                actionIcon={
                  <IconButton
                    sx={{ background: 'rgba(255, 255, 255, 0.54)' }}
                    aria-label={`Add a ${product.title} to your cart`}
                  >
                    <AddIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <DialogContent>
          <Stack>
            {selectedProduct.hasOwnProperty('relationships') ?
              <Img fluid={ selectedProduct.relationships.field_image.localFile.childImageSharp.fluid }/>
              : <img src="https://source.unsplash.com/random" alt="random item"/>
            }
            <Typography id="modal-product-title" variant="h6" component="h2" sx={{ mt: 0.5 }}>
              {selectedProduct.title}
            </Typography>
            <Typography id="modal-product-description" sx={{ mb: 1 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Stack direction="row">
                <IconButton
                  style={mathButtonStyle}
                  onClick={() => {
                    let count = (selectedProductCount-1 < 0) ? 1 : selectedProductCount-1;
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
      </div>
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
                  fluid(cropFocus: NORTH, maxWidth: 250, maxHeight: 180) {
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