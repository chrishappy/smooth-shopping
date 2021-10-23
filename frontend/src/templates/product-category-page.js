import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Img from "gatsby-image"


const ProductCategories = ({ data }) => {
  console.log(data);
  const taxonomyTerm = data.taxonomyTermProductCategories;
  const products = data.allNodeProduct.edges;
        
  // const rows = 1;
  // const cols = 2;

  return (
    <Layout>
      <div>
        <h1>{ taxonomyTerm.name }</h1>

        <ImageList>
          {products.map(({ node: product }) => (
            <ImageListItem key={product.id}>
              <Img fluid={ product.relationships.field_image.localFile.childImageSharp.fluid } />
              <ImageListItemBar
                title={product.title}
                subtitle={<span>Before BBD</span>}
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