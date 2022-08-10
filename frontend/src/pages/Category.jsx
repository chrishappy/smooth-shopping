import React from 'react';
import { useQuery } from '@apollo/client';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';

import { GET_PRODUCTS_OF_CATEGORY } from '../helpers/queries';
import { Navigate, useLocation } from 'react-router-dom';
import ProductListInfinityScroll from '../components/ProductListInfiniteScroll';
import { hasExistentProperty } from '../helpers/genericHelper';

const CategoryProducts = () => {
  let categoryId = null;
  let title = null;

  const { state } = useLocation(); // https://ui.dev/react-router-pass-props-to-link/

  if (state && hasExistentProperty(state, 'title', 'categoryId')) {
    categoryId = state.categoryId;
    title = state.title;
  }

  const { loading, error, data, refetch, fetchMore } = useQuery(GET_PRODUCTS_OF_CATEGORY, {
    variables: { categoryId },
    offset: 0,
  });

  // If there is no state information, redirect to the front page
  if (categoryId == null) {
    return (
      <Navigate to="/"></Navigate>
    );
  }

  return (
    <>
      <Stack 
        direction="row" 
        sx={{ alignContent: 'center', justifyContent: 'space-between' }}>
        <h1>{ title }</h1>
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
        queryInfo={{loading, error, data, fetchMore}}
        />
    </>
  )
}

export default CategoryProducts;