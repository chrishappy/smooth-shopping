import React from "react";
import { useLocation } from 'react-router-dom';
import { useQuery } from "@apollo/client";

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';

import "./categories/Category"
import { SEARCH_FOR_PRODUCT } from "../helpers/queries";
import ProductListInfinityScroll from "../components/ProductListInfiniteScroll";

function useUrlQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const SearchProducts = () => {
  const query = useUrlQuery();
  const searchTerms = query.get('keys') || '';
  const processedSearchTermsVariables = searchTerms.split(' ', 3);
  
  const { loading, error, data, refetch, fetchMore } = useQuery(SEARCH_FOR_PRODUCT, {
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
              refetch();
            }} >
            <CachedIcon />
          </IconButton>
        </div>
      </Stack>
      <ProductListInfinityScroll
        queryInfo={{loading, error, data, fetchMore}}/>
    </>
  )
}

export default SearchProducts;