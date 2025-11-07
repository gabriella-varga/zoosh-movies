import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
      primary: { main: '#FFB300' },
      secondary: { main: '#BB86FC' },
      text: {
        primary: '#E0E0E0',
        secondary: '#9E9E9E',
      },
      divider: '#2C2C2C',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: { backgroundColor: '#181818' },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            '&.app-container': {
              boxShadow: '0 0 40px rgba(255, 179, 0, 0.3), 0 0 80px rgba(255, 179, 0, 0.15)',
              borderRadius: 24,
              padding: 24,
              marginTop: 16,
            },
          },
        },
      },
    },
  });

export default theme;