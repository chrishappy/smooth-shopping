import * as React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import Img from "gatsby-image"
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

import Seo from "../components/seo"

const HomePage = ({data}) => (
  <>
    <Seo title="Home" />
    <h1>Start Shopping</h1>
    <h1>test:{data.allTaxonomyTermProductCategories.totalCount}</h1>
    <div className="categories-wrap">
      <ImageList>
        {data.allTaxonomyTermProductCategories.nodes.map((category) => (
          <ImageListItem key={category.id}>
            <Link to={category.path.alias}>
              <Img fluid={ category.relationships.field_image.localFile.childImageSharp.fluid } />
              <ImageListItemBar
                title={category.name}
                subtitle={category.author}
                sx={{
                  top: 0,
                  textAlign: 'center',
                  background: 'rgba(0,0,0,0.6)',
                  fontWeight: 'bold',
                }}

                // actionIcon={
                //   <IconButton
                //     sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                //     aria-label={`info about ${category.title}`}
                //   >
                //     <InfoIcon />
                //   </IconButton>
                // }
              />
            </Link>
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  </>
)

export const query = graphql`
  query HomePageQuery {
    allTaxonomyTermProductCategories {
      totalCount
      nodes {
        id
        name
        path {
          alias
        }
        relationships {
          field_image {
            localFile {
              childImageSharp {
                fluid(cropFocus: NORTH, maxWidth: 180, maxHeight: 180) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default HomePage;