import { IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { AddOrderItem, MinusOrderItem, useMaxAndMinQuantitiesForProduct } from "../helpers/cartHelper";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


const ProductAddRemoveButtons = ({
  selectedProduct,
  currentQuantity,
  direction = "column",
  iconFontSize = 12,
  onMinusOrderItemClick = () => {
    MinusOrderItem(selectedProduct, 1);
  },
  onAddOrderItemClick = (maxQuantity) => {
    AddOrderItem(selectedProduct, 1, maxQuantity);
  },
  enableMinQuantityCheck = false,
}) => {
  
  // Max and min quantities
  const [maxQuantity, minQuantity] = useMaxAndMinQuantitiesForProduct(selectedProduct);  

  // If the quantity is zero, set the count to be zero too to deactivate the buttons
  if (maxQuantity === 0.0 && currentQuantity !== 0.0) {
    currentQuantity = 0.0;
  }

  console.log(maxQuantity);
  return (
    <Stack direction={direction} justifyContent={'center'} alignContent={'center'}>
      <IconButton
        sx={{ order: direction === 'row' ? 1 : null }}
        className='math-button-style'
        onClick={() => {
          onAddOrderItemClick(maxQuantity);
        }}
        disabled={currentQuantity >= maxQuantity}>
        <AddIcon sx={{ fontSize: iconFontSize, }} />
      </IconButton>
      <Box 
        className="modal-product-count" 
        sx={{ margin: '0.4em 0.5em' }}
        >
        <span>{ currentQuantity }</span>
      </Box>
      <IconButton
        className='math-button-style'
        sx={{ order: direction === 'row' ? -1 : null }}
        onClick={() => {
          onMinusOrderItemClick(minQuantity);
        }}
        disabled={enableMinQuantityCheck 
          && currentQuantity <= minQuantity}>
        <RemoveIcon sx={{ fontSize: iconFontSize, }} />
      </IconButton>
    </Stack>
  )
}

export default ProductAddRemoveButtons;