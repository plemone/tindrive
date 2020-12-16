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
        </Head>
        <main>Hello World</main>
    </div>
);

export default Home;
