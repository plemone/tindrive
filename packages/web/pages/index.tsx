import React from 'react';
import { Container } from '@material-ui/core';
import { Files } from '../src';

const Index: React.FC = () => (
    <Container>
        <Files path='./' />
    </Container>
);

export default Index;
