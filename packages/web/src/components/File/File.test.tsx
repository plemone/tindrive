import React from 'react';
import { render } from '@testing-library/react';
import File from '.';

describe(File, () => {
    test('render file', async () => {
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

        const { queryByText, getByTestId } = render(
            <File
                onClick={(): boolean => true}
                {...file}
            />,
        );
        expect(getByTestId('file-./file')).toBeInTheDocument();
        expect(getByTestId('file-icon')).toBeInTheDocument();
        expect(queryByText(file.name)).toBeInTheDocument();
    });

    test('render folder', async () => {
        const folder = {
            name: 'folder',
            path: './folder',
            extension: null,
            isDirectory: true,
            parentDirectory: '.',
            size: 4096,
            createdDate: new Date(),
            populatedDate: new Date(),
        };

        const { queryByText, getByTestId } = render(
            <File
                onClick={(): boolean => true}
                {...folder}
            />,
        );
        expect(getByTestId('file-./folder')).toBeInTheDocument();
        expect(getByTestId('folder-icon')).toBeInTheDocument();
        expect(queryByText(folder.name)).toBeInTheDocument();
    });

    test('tooltip on character limit', () => {
        let file = {
            name: 'file',
            path: './file',
            extension: null,
            isDirectory: false,
            parentDirectory: '.',
            size: 4096,
            createdDate: new Date(),
            populatedDate: new Date(),
        };

        let renderedComponent = render(
            <File
                onClick={(): boolean => true}
                {...file}
            />,
        );
        expect(renderedComponent.queryByTestId('file-tooltip')).not.toBeInTheDocument();

        file = {
            name: 'somefilenamegreaterthantwentycharacterlong',
            path: './somefilenamegreaterthantwentycharacterlong',
            extension: null,
            isDirectory: false,
            parentDirectory: '.',
            size: 4096,
            createdDate: new Date(),
            populatedDate: new Date(),
        };

        renderedComponent = render(
            <File
                onClick={(): boolean => true}
                {...file}
            />,
        );
        expect(renderedComponent.queryByTestId('file-tooltip')).toBeInTheDocument();
    });
});
