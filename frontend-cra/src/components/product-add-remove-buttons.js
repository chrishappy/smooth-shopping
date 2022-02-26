import { IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { AddOrderItem, cartItemsVar, MinusOrderItem, useMaxAndMinQuantitiesForProduct } from "../helpers/cartHelper";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useReactiveVar } from "@apollo/client";


const ProductAddRemoveButtons = ({selectedProduct}) => {
  
  // Max and min quantities
  const [maxQuantity] = useMaxAndMinQuantitiesForProduct(selectedProduct);  
  const cartIdsAndQuantities = useReactiveVar(cartItemsVar);

  return (
    <Box sx={{  display: 'flex', flex: '1 0 auto', textAlign: 'center', maxWidth: '2.1rem', margin: '0 0.7rem 0 0' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
        <Stack direction="column">
          <IconButton
            className='math-button-style'
            sx={{ height: '1.1em', width: '1.1em' }}
            onClick={() => {
              AddOrderItem(selectedProduct, 1, maxQuantity);
            }}
            disabled={cartIdsAndQuantities.get(selectedProduct.nid) >= selectedProduct.fieldQuantity}>
            <AddIcon sx={{ fontSize: 12, }} />
          </IconButton>
          <Box className="modal-product-count" sx={{ ml:0.5, mr:0.5, fontSize: 15 }}>
            <span>{ cartIdsAndQuantities.get(selectedProduct.nid) }</span>
          </Box>
          <IconButton
            className='math-button-style'
            sx={{ height: '1.1em', width: '1.1em' }}
            onClick={() => {
              MinusOrderItem(selectedProduct, 1);
            }}
            >
            <RemoveIcon sx={{ fontSize: 12, }} />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  )
}

export default ProductAddRemoveButtons;