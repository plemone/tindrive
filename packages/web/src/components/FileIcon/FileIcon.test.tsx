import React from 'react';
import { render } from '@testing-library/react';
import FileIcon from '.';

describe(FileIcon, () => {
    test('render fileIcon', async () => {
        const fileIcon = {
            name: 'fileIcon',
            path: './fileIcon',
            extension: null,
            isDirectory: false,
            parentDirectory: '.',
            size: 4096,
            createdDate: new Date(),
            populatedDate: new Date(),
        };

        const { queryByText, getByTestId } = render(
            <FileIcon
                onClick={(): boolean => true}
                {...fileIcon}
            />,
        );
        expect(getByTestId('fileIcon-icon./fileIcon')).toBeInTheDocument();
        expect(getByTestId('fileIcon-iconicon')).toBeInTheDocument();
        expect(queryByText(fileIcon.name)).toBeInTheDocument();
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
            <FileIcon
                onClick={(): boolean => true}
                {...folder}
            />,
        );
        expect(getByTestId('fileIcon-icon./folder')).toBeInTheDocument();
        expect(getByTestId('folder-icon')).toBeInTheDocument();
        expect(queryByText(folder.name)).toBeInTheDocument();
    });

    test('tooltip on character limit', () => {
        let fileIcon = {
            name: 'fileIcon',
            path: './fileIcon',
            extension: null,
            isDirectory: false,
            parentDirectory: '.',
            size: 4096,
            createdDate: new Date(),
            populatedDate: new Date(),
        };

        let renderedComponent = render(
            <FileIcon
                onClick={(): boolean => true}
                {...fileIcon}
            />,
        );
        expect(renderedComponent.queryByTestId('fileIcon-icontooltip')).not.toBeInTheDocument();

        fileIcon = {
            name: 'somefileIconnamegreaterthantwentycharacterlong',
            path: './somefileIconnamegreaterthantwentycharacterlong',
            extension: null,
            isDirectory: false,
            parentDirectory: '.',
            size: 4096,
            createdDate: new Date(),
            populatedDate: new Date(),
        };

        renderedComponent = render(
            <FileIcon
                onClick={(): boolean => true}
                {...fileIcon}
            />,
        );
        expect(renderedComponent.queryByTestId('fileIcon-icontooltip')).toBeInTheDocument();
    });
});
