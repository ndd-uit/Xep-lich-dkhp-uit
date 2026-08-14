import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, Theme, ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import ReactDOM from 'react-dom';
import { buildTracker } from './tracker';
import { checkAdBlocker } from './tracking.utils';
import { useDrawerStore, useUtilsStore } from './zus';

import App from './views/App';

import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@fontsource/be-vietnam-pro/800.css';
import 'ag-grid-enterprise/styles/ag-grid.css';
import 'ag-grid-enterprise/styles/ag-theme-alpine.css';
declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

export const isProd = process.env.NODE_ENV === 'production';

export const tracker = buildTracker();
checkAdBlocker().then((hasAdBlocker) => {
  tracker.updateProperty('hasAdBlocker', hasAdBlocker);
  tracker.updateProperty('leftDrawerInitiallyOpen', useDrawerStore.getState().isDrawerOpen);
  useUtilsStore.setState({ hasAdBlocker });
});

const theme = createTheme({
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: `"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
    h1: { fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.16 },
    h2: { fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 },
    h3: { fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.24 },
    h4: { fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.25 },
    h5: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3 },
    h6: { fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.35 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.65 },
    button: { fontWeight: 700, letterSpacing: '-0.01em' },
  },
  palette: {
    primary: { main: '#006897', dark: '#004c70', light: '#e1f2f8', contrastText: '#ffffff' },
    secondary: { main: '#167da8' },
    success: { main: '#18845b', dark: '#116642', light: '#e6f5ee' },
    error: { main: '#c33d4b', dark: '#9d2937', light: '#fdecee' },
    background: { default: '#f3f7f9', paper: '#ffffff' },
    text: { primary: '#162738', secondary: '#607181' },
    divider: '#d8e3e9',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f3f7f9',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
        },
        '::selection': {
          backgroundColor: '#cbe7f2',
          color: '#123047',
        },
        a: {
          color: '#006897',
          textUnderlineOffset: '3px',
          textDecorationThickness: '1px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: 'none',
          fontWeight: 700,
          minHeight: 40,
          paddingLeft: 18,
          paddingRight: 18,
          textTransform: 'none',
          transition:
            'background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, transform 120ms ease',
          '&:active': { transform: 'translateY(1px)' },
          '&.Mui-focusVisible': { outline: '3px solid rgba(0, 104, 151, 0.24)', outlineOffset: 2 },
        },
        contained: {
          boxShadow: '0 5px 14px rgba(0, 76, 112, 0.16)',
          '&:hover': { boxShadow: '0 7px 18px rgba(0, 76, 112, 0.22)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        outlined: {
          borderColor: '#d8e3e9',
          boxShadow: '0 12px 32px rgba(44, 78, 96, 0.07)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#7fa8ba' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2 },
        },
        notchedOutline: { borderColor: '#bfd0d9' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
        outlinedInfo: { backgroundColor: '#f5fbfd', borderColor: '#b8dce9' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: '0.75rem', lineHeight: 1.5, borderRadius: 8 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': { outline: '3px solid rgba(0, 104, 151, 0.24)', outlineOffset: 2 },
        },
      },
    },
  },
});

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.render(
    <SnackbarProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </SnackbarProvider>,
    rootElement,
  );
}
