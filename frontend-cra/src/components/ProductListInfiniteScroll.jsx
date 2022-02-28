import React from 'react';
import MainContentLoader from './MainContentLoader';
import GoToCartButton from './GoToCartButton';
import { Waypoint } from 'react-waypoint';
import { ProductList } from './ProductList';
import { ProductDialog } from './ProductDialog';

const ProductListInfinityScroll = (
  { queryInfo: {loading, error, data, fetchMore},
  showCheckoutButton = true, // Currently not used
}) => {

  // For Dialog Product
  const [selectedProduct, setProduct] = React.useState({});
  const [isOpen, setOpen] = React.useState(false);

  if (error) {
    console.error(error);
  }

  // Calculate the max and min quantity a user can buy
  return (
    <>
      { loading
          ? <MainContentLoader />
          : error 
            ? <p>{error.message}</p>
            : <ProductList 
                setProduct={setProduct} 
                setOpen={setOpen}
                data={data} />
      }
      <Waypoint
        onEnter={() => {
          console.log('fetching more products')
          if (!error && !loading) {
             // TODO: Prevent fetching more if no more items to fetch?
            fetchMore({
              variables: {
                offset: data.products.length,
                limit: 50, // for GET_ALL_PRODUCTS
              }
            });
          }
        }}
        bottomOffset={'-1000px'} // Load more products when user is near the end
         />
      {showCheckoutButton 
        ? <GoToCartButton />
        : ''
      }
      <ProductDialog 
        selectedProduct={selectedProduct} 
        reactOpen={[isOpen, setOpen]} />
    </>
  );
}

export default ProductListInfinityScroll;