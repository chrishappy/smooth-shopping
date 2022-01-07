import * as React from "react"
// import { graphql } from "gatsby"
// import { Link } from "gatsby"
// import Img from "gatsby-image"
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import Seo from "../components/seo"
import { GET_PRODUCT_CATEGORIES } from "../helpers/queries";
import MainContentLoader from "../components/main-content-loader";

const HomePage = () => (
  <>
    <Seo title="Home" />
    <h1 style={{ textAlign: 'center' }}>Start Shopping</h1>
    <div className="categories-wrap">
      <Categories/>
    </div>
  </>
);

function Categories() {
  const { loading, error, data } = useQuery(GET_PRODUCT_CATEGORIES);

  if (loading) {
    return (
      <MainContentLoader />
    )
  }
  if (error) {
    console.error(error);
    return <p>There was an error.</p>;
  }

  // console.log(data.taxonomyTermQuery.entities);
  return <ImageList>
    {data.taxonomyTermQuery.entities.map((category) => (
      <ImageListItem key={category.entityId} variant="masonry">
        <Link to={category.entityUrl.path} state={{ title: category.entityLabel }}>
          <img 
            src={category.fieldImage.derivative.url} 
            alt={category.fieldImage.alt} 
            title={category.fieldImage.title}
            width={category.fieldImage.derivative.width}
            height={category.fieldImage.derivative.height} />
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
    ))}
  </ImageList>
}


export default HomePage;