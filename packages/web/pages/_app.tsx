import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@material-ui/core/CssBaseline';
import createCache from '@emotion/cache';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { theme } from '../src';

export const cache = createCache({ key: 'css', prepend: true });

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
});

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement?.removeChild(jssStyles);
        }
    }, []);

    return (
        <ApolloProvider client={client}>
            <CacheProvider value={cache}>
                <Head>
                    <title>Tindrive</title>
                    <meta
                        content='initial-scale=1, width=device-width'
                        name='viewport'
                    />
                </Head>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Component {...pageProps} />
                </ThemeProvider>
            </CacheProvider>
        </ApolloProvider>
    );
};

export default App;
