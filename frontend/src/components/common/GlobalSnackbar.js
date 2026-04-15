'use client';
// src/components/common/GlobalSnackbar.js
import { Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { hideSnack } from '@/store/slices/uiSlice';

export default function GlobalSnackbar() {
  const dispatch = useDispatch();
  const { snackbar } = useSelector((s) => s.ui);

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={() => dispatch(hideSnack())}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={() => dispatch(hideSnack())}
        severity={snackbar.severity}
        sx={{
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 700,
          borderRadius: '14px',
          fontSize: '0.88rem',
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}
