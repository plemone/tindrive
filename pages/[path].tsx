import React from 'react';
import Cookie from 'cookie';
import { Files } from '../src';

const Index = ({ viewAs }): JSX.Element => <Files viewAs={viewAs} />;

Index.getInitialProps = ({ req }): {} => {
    const cookies = Cookie.parse(req ? req.headers.cookie || '' : document.cookie);
    return { viewAs: cookies.viewAs };
};

export default Index;
