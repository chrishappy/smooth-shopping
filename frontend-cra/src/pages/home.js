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
import { CircularProgress } from "@mui/material";
import { GET_PRODUCT_CATEGORIES } from "../helpers/queries";

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
    return <>
      <div style={{ 
        textAlign: 'center',
        padding: '2em 0 0', }}>
        <CircularProgress />
      </div>
    </>
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
    ))}
  </ImageList>
}


export default HomePage;