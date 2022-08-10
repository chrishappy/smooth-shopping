import { IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { AddOrderItem, MinusOrderItem, useMaxAndMinQuantitiesForProduct } from "../helpers/cartHelper";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './ProductAddRemoveButtons.css'
import { debuggingIsOn } from "../helpers/genericHelper";

/**
 * 
 * @param {object} options 
 * @returns 
 */
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
  enableMinQuantityCheck = false, // Only for product dialog
  showZeroIfMaxQuantityIsZero = false, // Only for product dialog
  switchToTotalMode = false, // Only for carts
}) => {
  
  // Max and min quantities
  const [maxQuantity, minQuantity] = useMaxAndMinQuantitiesForProduct(selectedProduct);  

  // If the quantity is zero, set the count to be zero too to deactivate the buttons
  if (showZeroIfMaxQuantityIsZero && maxQuantity === 0.0) {
    currentQuantity = 0.0;
  }

  const buttonClasses = 'product-button__icon' + (direction === 'row' ? '' : ' math-button-style--small');

  if (debuggingIsOn()) {
    console.log(`The max maxQuantity is ${maxQuantity}`);
  }

  return (
    <Stack direction={direction} justifyContent={'center'} alignContent={'center'}>
      <Box className="product-button"
          sx={{ order: direction === 'row' ? 1 : null }}>
        <IconButton
          className={buttonClasses}
          onClick={() => {
            onAddOrderItemClick(maxQuantity);
          }}
          disabled={switchToTotalMode ? maxQuantity <= 0 : currentQuantity >= maxQuantity}>
          <AddIcon sx={{ fontSize: iconFontSize, }} />
        </IconButton>
      </Box>
      <Box className="modal-product-count">
        <span>{ currentQuantity }</span>
      </Box>
      <Box className="product-button"
          sx={{ order: direction === 'row' ? -1 : null }}>
        <IconButton
          className={buttonClasses}
          onClick={() => {
            onMinusOrderItemClick(minQuantity);
          }}
          disabled={enableMinQuantityCheck 
            && currentQuantity <= minQuantity}>
          <RemoveIcon sx={{ fontSize: iconFontSize, }} />
        </IconButton>
      </Box>
    </Stack>
  )
}

export default ProductAddRemoveButtons;