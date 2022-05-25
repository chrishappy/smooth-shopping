import * as React from 'react';
import { makeVar, useReactiveVar } from "@apollo/client";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export const SnackbarType = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
}

export const snackbarOpenVar = makeVar(false);
export const snackbarTypeVar = makeVar(SnackbarType.info);
export const snackbarMsgVar = makeVar("Default snackbar message!?");

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomizedSnackbar = () => {
  const snackbarOpen = useReactiveVar(snackbarOpenVar);
  const snackbarType = useReactiveVar(snackbarTypeVar);
  const snackbarMsg = useReactiveVar(snackbarMsgVar);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    snackbarOpenVar(false);
  };

  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert
        onClose={handleClose}
        severity={snackbarType}>
        {snackbarMsg}
      </Alert>
    </Snackbar>
  );
};

export default CustomizedSnackbar;