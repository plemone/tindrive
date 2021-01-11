import React from 'react';
import { cleanup, render } from '@testing-library/react';
import FileIcon from '.';

describe('FileIcon', () => {
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

        const component = render(
            <FileIcon
                onClick={(): boolean => true}
                {...fileIcon}
            />,
        );
        expect(component.getByTestId('fileIcon-icon./fileIcon')).toBeInTheDocument();
        expect(component.getByTestId('fileIcon-iconicon')).toBeInTheDocument();
        expect(component.queryByText(fileIcon.name)).toBeInTheDocument();
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

        const component = render(
            <FileIcon
                onClick={(): boolean => true}
                {...folder}
            />,
        );
        expect(component.getByTestId('fileIcon-icon./folder')).toBeInTheDocument();
        expect(component.getByTestId('folder-icon')).toBeInTheDocument();
        expect(component.queryByText(folder.name)).toBeInTheDocument();
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

        let component = render(
            <FileIcon
                onClick={(): boolean => true}
                {...fileIcon}
            />,
        );
        expect(component.queryByTestId('fileIcon-icontooltip')).not.toBeInTheDocument();
        cleanup();

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

        component = render(
            <FileIcon
                onClick={(): boolean => true}
                {...fileIcon}
            />,
        );
        expect(component.queryByTestId('fileIcon-icontooltip')).toBeInTheDocument();
    });
});
