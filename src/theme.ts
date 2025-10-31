import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: { mode: 'dark' },
    shape: { borderRadius: 12 },
    typography: { fontFamily: 'Inter, system-ui, Roboto, Arial, sans-serif' },
    components: {
        MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 12 } } },
        MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
    },
});

export default theme;