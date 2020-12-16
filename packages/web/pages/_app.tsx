import React from 'react';

interface AppProps {
    Component: React.FC;
    pageProps: {};
}

const App: React.FC<AppProps> = ({ Component, pageProps }) => <Component {...pageProps} />;

export default App;
