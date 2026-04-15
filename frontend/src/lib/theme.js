// src/lib/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#C0392B',
      light: '#E74C3C',
      dark: '#922B21',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E67E22',
      light: '#F0A500',
      dark: '#CA6F1E',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FDF6F0',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1010',
      secondary: '#6B4C4C',
    },
    divider: 'rgba(192,57,43,0.10)',
    success: { main: '#27AE60' },
    error: { main: '#C0392B' },
  },
  typography: {
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    h1: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 },
    h3: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 600 },
    h4: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 600 },
    h5: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 600 },
    h6: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 600 },
    body1: {
      fontFamily: '"Nunito", sans-serif',
      fontSize: '0.95rem',
      lineHeight: 1.65,
    },
    body2: {
      fontFamily: '"Nunito", sans-serif',
      fontSize: '0.85rem',
      lineHeight: 1.55,
    },
    button: {
      fontFamily: '"Nunito", sans-serif',
      fontWeight: 700,
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"Nunito", sans-serif',
      fontSize: '0.75rem',
    },
    subtitle1: { fontFamily: '"Nunito", sans-serif', fontWeight: 600 },
    subtitle2: { fontFamily: '"Nunito", sans-serif', fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Nunito:wght@300;400;500;600;700;800&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

        body {
          background: #FDF6F0;
          min-height: 100vh;
        }

        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(192,57,43,0.25); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(192,57,43,0.5); }

        ::selection { background: rgba(192,57,43,0.18); }

        a { color: inherit; text-decoration: none; }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: '9px 22px',
          fontWeight: 700,
          transition: 'all 0.2s ease',
          '&:hover': { transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        contained: {
          background: 'linear-gradient(135deg, #C0392B 0%, #922B21 100%)',
          boxShadow: '0 4px 14px rgba(192,57,43,0.30)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
            boxShadow: '0 6px 20px rgba(192,57,43,0.42)',
          },
        },
        outlined: {
          borderColor: 'rgba(192,57,43,0.35)',
          color: '#C0392B',
          '&:hover': {
            borderColor: '#C0392B',
            background: 'rgba(192,57,43,0.05)',
          },
        },
        text: {
          color: '#C0392B',
          '&:hover': { background: 'rgba(192,57,43,0.06)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          border: '1px solid rgba(192,57,43,0.07)',
          boxShadow: '0 2px 14px rgba(192,57,43,0.05)',
          transition: 'box-shadow 0.25s ease, transform 0.25s ease',
          background: '#FFFFFF',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #C0392B 0%, #E67E22 100%)',
          fontFamily: '"Cormorant Garamond", serif',
          fontWeight: 700,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            fontFamily: '"Nunito", sans-serif',
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C0392B' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C0392B', borderWidth: 2 },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#C0392B' },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': { background: 'rgba(192,57,43,0.08)', transform: 'scale(1.08)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 700,
          fontSize: '0.72rem',
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: 'rgba(192,57,43,0.08)' } },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#1C1010',
          fontFamily: '"Nunito", sans-serif',
          fontSize: '0.72rem',
          borderRadius: 8,
          padding: '6px 10px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 22,
          border: '1px solid rgba(192,57,43,0.08)',
          boxShadow: '0 24px 60px rgba(192,57,43,0.14)',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: { '& .MuiAlert-root': { borderRadius: 14 } },
      },
    },
  },
});
