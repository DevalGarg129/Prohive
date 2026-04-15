'use client';
// src/components/common/Providers.js
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { theme } from '@/lib/theme';
import { Toaster } from 'react-hot-toast';
import GlobalSnackbar from './GlobalSnackbar';

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
          <GlobalSnackbar />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 600,
                background: '#1C1010',
                color: '#fff',
                borderRadius: '14px',
                padding: '12px 20px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#C0392B', secondary: '#fff' } },
            }}
          />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
