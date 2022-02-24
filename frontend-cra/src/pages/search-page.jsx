import React from "react";
import { useLocation } from 'react-router-dom';
import { useQuery } from "@apollo/client";
import MainContentLoader from "../components/main-content-loader";

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';

import "./categories/category"
import GoCheckoutButton from "../components/go-checkout-button";
import { SEARCH_FOR_PRODUCT } from "../helpers/queries";
import { ProductDialog, Products } from "./categories/category";

function useUrlQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const SearchProducts = () => {
  const [selectedProduct, setProduct] = React.useState({});
  const [isOpen, setOpen] = React.useState(false);

  const query = useUrlQuery();
  const searchTerms = query.get('keys') || '';
  const processedSearchTermsVariables = searchTerms.split(' ', 3);
  
  const { loading, error, data, refetch } = useQuery(SEARCH_FOR_PRODUCT, {
    variables: {
      searchTerm1: encodeURIComponent(processedSearchTermsVariables[0]),
      searchTerm2: encodeURIComponent(processedSearchTermsVariables[1]),
      searchTerm3: encodeURIComponent(processedSearchTermsVariables[2]),
    },
  });

  if (error) {
    console.log(error);
  }

  return (
    <>
      <Stack 
        direction="row" 
        sx={{ alignContent: 'center', justifyContent: 'space-between' }}>
        <h1>Search for "{searchTerms}"</h1>
        <div>
          <IconButton
            color="primary"
            aria-label={'Refresh page'}
            onClick={() => {
              console.log('Clear caches');
              refetch();
            }} >
            <CachedIcon />
          </IconButton>
        </div>
      </Stack>
      { loading 
          ? <MainContentLoader />
          : error 
            ? <p>{error.message}</p>
            : <Products 
                setProduct={setProduct} 
                setOpen={setOpen}
                data={data} />
      }
      <GoCheckoutButton />
      <ProductDialog 
        selectedProduct={selectedProduct} 
        isOpen={isOpen}
        setOpen={setOpen} />
      {/* { products.length === 0 ? (<p>There are currently no products.</p>) : ''} */}
    </>
  )
}

export default SearchProducts;