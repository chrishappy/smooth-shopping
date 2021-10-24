import React from "react"
import { graphql } from "gatsby"
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Img from "gatsby-image"
import { connect } from "react-redux"

const ProductCategories = ({ data, appState, storeDispatch }) => {
  const taxonomyTerm = data.taxonomyTermProductCategories;
  const products = data.allNodeProduct.edges;
  
  // const [filters, setfilters] = useState([]);

  // const rows = 1;
  // const cols = 2;

  return (
    <>
      <div>
        <h1>{ taxonomyTerm.name }</h1>

        <ImageList
          sx={{ margin: '0' }}
          className="product-list">
          {products.map(({ node: product }) => (
            <ImageListItem key={product.id}>
              <Img fluid={ product.relationships.field_image.localFile.childImageSharp.fluid } />
              <ImageListItemBar
                title={product.title}
                subtitle={<span>BBD: <strong>Before</strong></span>}
                position="below"
                actionIcon={
                  <IconButton
                    sx={{ background: 'rgba(255, 255, 255, 0.54)' }}
                    aria-label={`Add a ${product.title} to your cart`}
                    onClick={() => {
                      storeDispatch({
                        type: 'addProduct',
                        product
                      });
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
        
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