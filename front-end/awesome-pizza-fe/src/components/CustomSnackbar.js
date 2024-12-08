
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const CustomSnackbar = ({ messageInfo, onClose }) => {
  const { message, severity } = messageInfo;

  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;