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
import { GET_ALL_PRODUCTS, GET_PRODUCT_CATEGORIES } from "../helpers/queries";
import MainContentLoader from "../components/main-content-loader";
import { ProductListInfinityScroll } from "./categories/category";

const HomePage = () => (
  <>
    <Seo title="Home" />
    <h1 style={{ textAlign: 'center' }}>Start Shopping</h1>
    <div className="categories-wrap">
      {/* <h2>Categories</h2> */}
      <Categories/>
    </div>
    <div>
      <AllProductsInfiniteScroll />
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

  const { categories } = data;

  return <ImageList>
    {categories.map((category) => (
      <ImageListItem key={category.id} variant="masonry">
        <Link to={category.path.alias} state={{ title: category.name, categoryId: category.id }}>
          <img 
            src={category.fieldImage.imageStyleUri.productCategory} 
            alt={category.fieldImage.alt} 
            title={category.fieldImage.title}
            // width={category.fieldImage.derivative.width}
            // height={category.fieldImage.derivative.height}
             />
          <ImageListItemBar
            title={category.name}
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

function AllProductsInfiniteScroll() {
  const { loading, error, data, fetchMore } = useQuery(GET_ALL_PRODUCTS, {
    variables: {
      offset: 0,
    }
  });

  console.log(data);

  return (
    <>
      <h2 style={{textAlign: 'center', marginTop: '2em', }}>All Products</h2>
      <ProductListInfinityScroll
        queryInfo={{loading, error, data, fetchMore}}
        />
    </>
  )

}

export default HomePage;