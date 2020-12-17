import React from 'react';
import Head from 'next/head';

const Home: React.FC = () => (
    <div>
        <Head>
            <title>Project</title>
            <link
                href='/favicon.ico'
                rel='icon'
            />
            <link
                href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
                rel='stylesheet'
            />
        </Head>
        <main>Hello World</main>
    </div>
);

export default Home;
