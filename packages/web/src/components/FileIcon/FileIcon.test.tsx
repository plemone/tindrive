import React from 'react';
import {
    screen, cleanup, render, fireEvent,
    waitFor,
} from '@testing-library/react';
import FileIcon from '.';

describe('FileIcon', () => {
    test('render fileIcon', async () => {
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
            <FileIcon
                onClick={(): boolean => true}
                {...file}
            />,
        );
        expect(screen.getByText(file.name)).toBeInTheDocument();
        expect(screen.getByTestId('file-icon-file-icon')).toBeInTheDocument();
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

        render(
            <FileIcon
                onClick={(): boolean => true}
                {...folder}
            />,
        );
        expect(screen.getByText(folder.name)).toBeInTheDocument();
        expect(screen.getByTestId('file-icon-folder-icon')).toBeInTheDocument();
    });

    test('tooltip on character limit', async () => {
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

        render(
            <FileIcon
                onClick={(): boolean => true}
                {...fileIcon}
            />,
        );
        expect(screen.queryByTestId('fileIcon-icontooltip')).not.toBeInTheDocument();
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

        render(
            <FileIcon
                data-testid="file-icon"
                onClick={(): boolean => true}
                {...fileIcon}
            />,
        );
        jest.useFakeTimers();
        fireEvent.mouseOver(screen.getByTestId('file-icon'));
        await waitFor(() => {
            jest.advanceTimersByTime(100);
        });
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
});
