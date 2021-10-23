import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Img from "gatsby-image"
import storeWrapper from "../state/createStore"

const ProductCategories = ({ data }) => {
  const taxonomyTerm = data.taxonomyTermProductCategories;
  const products = data.allNodeProduct.edges;
  
  const { store } = storeWrapper();
  // const [filters, setfilters] = useState([]);

  // const rows = 1;
  // const cols = 2;

  return (
    <Layout>
      <div>
        <h1>{ taxonomyTerm.name }</h1>

        <ImageList
          sx={{ margin: '0' }}>
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
                      store.dispatch({
                        type: 'addProduct',
                        product
                      });

                      console.log(store.getState());
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>

      </div>
    </Layout>
  )
}
export default ProductCategories;

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
                absolutePath
                childImageSharp {
                  fluid(cropFocus: NORTH, maxWidth: 250, maxHeight: 180) {
                    ...GatsbyImageSharpFluid
                  }
                  fixed(cropFocus: NORTH, width: 250, height: 180) {
                    ...GatsbyImageSharpFixed
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