import * as React from "react"
// import { graphql } from "gatsby"
// import { Link } from "gatsby"
// import Img from "gatsby-image"
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
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

    console.log(data.taxonomyTermQuery.entities);

  return data.taxonomyTermQuery.entities.map((category) => (
    <ImageListItem key={category.entityId} variant="masonry">
      <Link to={category.entityUrl.path}>
        <img src={category.fieldImage.derivative.url} alt="" />
        <ImageListItemBar
          title={category.entityLabel}
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
    taxonomyTermQuery(filter: {
    conditions: [
      {operator: EQUAL, field: "vid", value: ["product_categories"]},
    ]}) {
      count
      entities {
        entityId
        entityUuid
        entityLabel
        entityType
        entityUrl {
          path
        }
        ... on TaxonomyTermProductCategories {
          fieldImage {
            derivative(style: PRODUCTCATEGORY) {
              url
            }
            alt
            title
          }
        }
      }
    }
  }
`;

export default HomePage;