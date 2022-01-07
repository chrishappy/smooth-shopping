
export const ProductDialog = ({isOpen, setOpen, selectedProduct}) => {

  const productQuantity = parseFloat(useReactiveVar(cartItemsVar).get(selectedProduct.entityId)) || 0.0;
  
  const maxQuantity = parseFloat(selectedProduct.fieldQuantity || 0.0) - productQuantity;
  const minQuantity = Math.min(maxQuantity, 1.0); // In case no more elements (e.g. maxQuantity is zero)

  const [selectedProductCount, setCount] = React.useState(1.0);

  const handleClose = () => {
    setOpen(false);
    setCount(1.0); // Revert to one
  };


  return (
    <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogContent sx={{
          minWidth: '20rem', 
          maxWidth: '97vw', 
          height: '95vh',
        }}>
        <Stack
          className="product-dialog">
          <Box className="product-dialog__img">
          {selectedProduct.hasOwnProperty('fieldImage')
            ? <img 
                src={selectedProduct.fieldImage.url} 
                alt={selectedProduct.fieldImage.alt}
                title={selectedProduct.fieldImage.title} 
                width={selectedProduct.fieldImage.width}
                height={selectedProduct.fieldImage.height} />
            : <img src="https://source.unsplash.com/random" alt="random item"/>}
          </Box>
          <Box className="product-dialog__content">
            <Box sx={{ margin: '0.5rem 0 1rem' }}>
              <Typography id="modal-product-title" variant="h6" component="h2" sx={{ mt: 0.5, fontWeight: 'bold' }}>
                {selectedProduct.entityLabel}
              </Typography>
              <Typography id="modal-product-description" component="p" sx={{ mb: 1 }}>
                {selectedProduct.fieldExpired
                  ? <span><WarningAmberIcon sx={{verticalAlign: 'top', color: '#FA9500' }}/>Expired</span>
                  : <span>Not expired</span>}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Stack direction="row" sx={{ alignContent: 'center' }}>
                <IconButton
                  className="math-button-style"
                  onClick={() => {
                    const count = Math.max(selectedProductCount-1, minQuantity);
                    setCount(count);
                  }}
                  disabled={selectedProductCount === minQuantity}
                >
                  <RemoveIcon sx={{ fontSize: 22 }} />
                </IconButton>
                <Box id="modal-product-count" sx={{ mt: 0.8, ml: 1, mr: 1 }}>
                  { // TODO: Remove hack: how to detect if maxQuantity is zero?
                    maxQuantity === 0.0 
                      ? 0.0 
                      : selectedProductCount
                  }
                </Box>
                <IconButton
                  className="math-button-style"
                  onClick={() => {
                    const count = Math.min(selectedProductCount + 1, maxQuantity);
                    setCount(count);
                  }}
                  disabled={selectedProductCount === maxQuantity}
                >
                  <AddIcon sx={{ fontSize: 22 }} />
                </IconButton>
              </Stack>
              <div style={{marginRight: 'auto'}}></div>
              <Button variant="contained"
                sx={{
                  backgroundColor: '#75F348',
                  color: 'black',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  padding: '0 10%'
                }}
                onClick={() => {                 
                  AddOrderItem(selectedProduct, selectedProductCount);
                  handleClose();
                }}>
                  Add to cart
              </Button>
            </Box>
          </Box>
        </Stack>
        </DialogContent>
      </Dialog>
  )
}