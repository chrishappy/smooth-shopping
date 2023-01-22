import React from 'react';
import ImageList from '@mui/material/ImageList';
import Box from '@mui/material/Box';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { hasNoMoreQuantity } from '../helpers/cartHelper';
import { Link } from '@mui/material';
import './ProductList.css'
import { formatFloat } from '../helpers/genericHelper';

export const ProductList = ({ setProduct, setOpen, data }) => {
  const { products } = data;

  // If no content
  if (!products || products.length === 0) {
    return (
      'No items at the moment.'
    );
  }

  // Default content
  return (
    <ImageList
      sx={{ margin: '0', padding: '0 0 6em' }}
      className="product-listings links-inherit-color"
      gap={16}>
      {products.map((product) => (
        <Link
          href="#"
          underline="none"
          key={product.id}
          className="product-listing"
          disabled={hasNoMoreQuantity(product)} // TODO: Use useMaxAndMinQuantitiesForProduct at some point
          tabIndex={hasNoMoreQuantity(product)? -1 : null}
          onClick={(e) => {
            e.preventDefault();
            setProduct(product);
            setOpen(true);
          }}>
          <img
            src={product.fieldImage.imageStyleUri.productCategory} 
            alt={product.fieldImage.alt} 
            title={product.fieldImage.title}
            width={product.fieldImage.width}
            height={product.fieldImage.height} />
          <Box className="product-listing__content">
            <h3 className="product-listing__title">{product.title}</h3>
            <Box sx={{ textAlign: 'right', }}>
              {product.fieldExpired ? <WarningAmberIcon sx={{verticalAlign: 'top', color: 'rgb(250 149 0 / 50%)' }}/> : ''} ${formatFloat(product.fieldCredit)}
            </Box>
          </Box>
        </Link>
      ))}
    </ImageList>
  );
}
