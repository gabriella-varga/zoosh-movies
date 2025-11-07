import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import './i18n/i18n';

const apiTarget = import.meta.env.VITE_API_TARGET;

const client = new ApolloClient({
    link: new HttpLink({
        uri: apiTarget,
        fetch,
    }),
    cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App/>
            </ThemeProvider>
        </ApolloProvider>
    </StrictMode>,
)
