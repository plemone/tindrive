import React from 'react';
import {
    screen, cleanup, render, fireEvent,
    waitFor,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import FileIcon from '.';
import commonEn from '../../translations/en/common.json';

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

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
            <I18nextProvider i18n={i18next}>
                <FileIcon
                    onClick={(): boolean => true}
                    {...file}
                />
            </I18nextProvider>,
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
            <I18nextProvider i18n={i18next}>
                <FileIcon
                    onClick={(): boolean => true}
                    {...folder}
                />
            </I18nextProvider>,
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
            <I18nextProvider i18n={i18next}>
                <FileIcon
                    onClick={(): boolean => true}
                    {...fileIcon}
                />
            </I18nextProvider>,
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
            <I18nextProvider i18n={i18next}>
                <FileIcon
                    data-testid="file-icon"
                    onClick={(): boolean => true}
                    {...fileIcon}
                />
            </I18nextProvider>,
        );
        jest.useFakeTimers();
        fireEvent.mouseOver(screen.getByTestId('file-icon'));
        await waitFor(() => {
            jest.advanceTimersByTime(100);
        });
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
});
