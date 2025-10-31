import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: { mode: 'light' },
    shape: { borderRadius: 16 },
    typography: { fontFamily: 'Inter, system-ui, Roboto, Arial, sans-serif' },
    components: {
        MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 12 } } },
        MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
    },
});

export default theme;