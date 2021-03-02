import React from 'react';
import Cookie from 'cookie';
import { Files } from '../src';

const Index = ({ viewAs }: { viewAs: 'icons' | 'list' | 'columns'}): JSX.Element => <Files viewAs={viewAs} />;

Index.getInitialProps = ({ req }): Record<string, string> => {
    const cookies = Cookie.parse(req ? req.headers.cookie || '' : document.cookie);
    return { viewAs: cookies.viewAs };
};

export default Index;
