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
                <App />
            </ThemeProvider>
        </ApolloProvider>
    </StrictMode>,
);

type SmartlookFunction = ((...args: unknown[]) => void) & { api: unknown[] };

declare global {
    interface Window {
        smartlook?: SmartlookFunction;
    }
}

if (typeof window !== 'undefined') {
    const smartlook =
        window.smartlook ||
        ((d: Document) => {
            const o = function (...args: unknown[]) {
                o.api.push(args);
            } as SmartlookFunction;
            o.api = [];
            window.smartlook = o;

            const head = d.getElementsByTagName('head')[0];
            const script = d.createElement('script');
            script.async = true;
            script.type = 'text/javascript';
            script.charset = 'utf-8';
            script.src = 'https://web-sdk.smartlook.com/recorder.js';
            (head ?? d.documentElement)?.appendChild(script);

            return o;
        })(document);

    smartlook('init', '51c7c3036fec90aa1cf2fd7d9e4bff30c3aaf6c0', { region: 'eu' });
}
