import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@material-ui/core/CssBaseline';
import createCache from '@emotion/cache';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import {
    theme,
    ContextMenuProvider,
    ConfirmationProvider,
} from '../src';
import commonEn from '../src/translations/en/common.json';
import '../public/index.css';

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

export const cache = createCache({ key: 'css', prepend: true });

export const client = new ApolloClient({
    // TODO - move this to a .env file
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
            <I18nextProvider i18n={i18next}>
                <CacheProvider value={cache}>
                    <Head>
                        <title>Tindrive</title>
                        <meta
                            content="initial-scale=1, width=device-width"
                            name="viewport"
                        />
                    </Head>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <ContextMenuProvider>
                            <ConfirmationProvider>
                                <Component {...pageProps} />
                            </ConfirmationProvider>
                        </ContextMenuProvider>
                    </ThemeProvider>
                </CacheProvider>
            </I18nextProvider>
        </ApolloProvider>
    );
};

export default App;
