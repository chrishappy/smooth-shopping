import * as React from "react"
// import { graphql } from "gatsby"
// import { Link } from "gatsby"
// import Img from "gatsby-image"
import { useQuery, gql } from "@apollo/client";
import Link from '@mui/material/Link';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

// import Seo from "../components/seo"

const HomePage = () => (
  <>
    {/* <Seo title="Home" /> */}
    <h1 style={{ textAlign: 'center' }}>Start Shopping</h1>
    <div className="categories-wrap">
      <ImageList>
        <Categories/>
      </ImageList>
    </div>
  </>
);

function Categories() {
  const { loading, error, data } = useQuery(CATEGORIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.taxonomyTermQuery.entities.map((category) => (
    <ImageListItem key={category.entityId} variant="masonry">
      <Link href={category.entityUrl.path}>
        {/* <Img fluid={ category.relationships.field_image.localFile.childImageSharp.fluid } /> */}
        <ImageListItemBar
          title={category.entityLabel}
          // subtitle={category.author}
          sx={{
            top: 0,
            textAlign: 'center',
            background: 'rgba(0,0,0,0.6)',
            fontWeight: 'bold',
          }}
        />
      </Link>
    </ImageListItem>
  ));
}

const CATEGORIES = gql`
  query GetCategories {
    taxonomyTermQuery {
      count
      entities {
        entityId
        entityUuid
        entityLabel
        entityType
        entityUrl {
          path
        }
      }
    }
  }
`;

// export const query = graphql`
//   query {
//     allTaxonomyTermProductCategories {
//       nodes {
//         id
//         name
//         path {
//           alias
//         }
//         relationships {
//           field_image {
//             localFile {
//               childImageSharp {
//                 fluid(cropFocus: NORTH, maxWidth: 180, maxHeight: 180) {
//                   ...GatsbyImageSharpFluid
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

export default HomePage;