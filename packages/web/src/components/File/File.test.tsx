import React from 'react';
import { render } from '@testing-library/react';
import File from '.';

describe(File, () => {
    test('render', async () => {
        const file = {
            name: 'file',
            path: './file',
            extension: null,
            isDirectory: false,
            parentDirectory: '.',
            size: 4096,
            createdDate: new Date(),
            populatedDate: new Date(),
        };

        render(
            <File
                onClick={(): boolean => true}
                {...file}
            />,
        );
    });
});
