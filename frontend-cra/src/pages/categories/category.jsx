import React from 'react';
import { useQuery } from '@apollo/client';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';

import { GET_PRODUCTS_OF_CATEGORY } from '../../helpers/queries';
import { useLocation } from 'react-router-dom';
import ProductListInfinityScroll from '../../components/ProductListInfiniteScroll';

const CategoryProducts = () => {
  const location = useLocation(); // https://ui.dev/react-router-pass-props-to-link/
  const { title, categoryId } = location.state;

  const { loading, error, data, refetch, fetchMore } = useQuery(GET_PRODUCTS_OF_CATEGORY, {
    variables: { categoryId },
    offset: 0,
  });

  // Update the clientLimit quantities
  // usePreviousOrderQuantitiesUpdater();

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
              console.log('Clear caches');
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