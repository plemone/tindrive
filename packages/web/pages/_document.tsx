import React from 'react';
import Document, { DocumentInitialProps, Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { RenderPageResult } from 'next/dist/next-server/lib/utils.d';
import createEmotionServer from '@emotion/server/create-instance';
import { theme } from '../src';
import { cache } from './_app';

const { extractCritical } = createEmotionServer(cache);

export default class MyDocument extends Document {
    render(): JSX.Element {
        return (
            <Html lang='en'>
                <Head>
                    <meta
                        content={theme.palette.primary.main}
                        name='theme-color'
                    />
                    <link
                        href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
                        rel='stylesheet'
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

MyDocument.getInitialProps = async (ctx): Promise<DocumentInitialProps> => {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = (): (
        RenderPageResult |
        Promise<RenderPageResult>) => originalRenderPage({ enhanceApp: App => (props): React.ReactElement => sheets.collect(<App {...props} />) });

    const initialProps = await Document.getInitialProps(ctx);
    const styles = extractCritical(initialProps.html);

    return {
        ...initialProps,
        styles: [
            ...React.Children.toArray(initialProps.styles),
            sheets.getStyleElement(),
            <style
                key='emotion-style-tag'
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: styles.css }}
                data-emotion={`css ${styles.ids.join(' ')}`}
            />,
        ],
    };
};
