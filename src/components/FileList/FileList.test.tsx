/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {
    render, waitFor, screen, cleanup,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import * as nextRouter from 'next/router';
import commonEn from '../../translations/en/common.json';
import { ls } from '../../queries';
import FileList from '.';

// @ts-ignore
nextRouter.useRouter = jest.fn();
// @ts-ignore
nextRouter.useRouter.mockImplementation(() => ({
    events: {
        on: jest.fn(),
        off: jest.fn(),
    },
    query: { path: './' },
}));

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe('FileList', () => {
    test('render', async () => {
        const data: Record<string, unknown>[] = [
            {
                name: 'file',
                path: './file',
                extension: null,
                isDirectory: false,
                parentDirectory: '.',
                createdDate: '2020-11-05T03:03:46.950Z',
                size: 2096,
                populatedDate: '2020-12-13T18:10:38.000Z',
            },
            {
                name: 'folder',
                path: './folder',
                extension: null,
                isDirectory: true,
                parentDirectory: '.',
                createdDate: '2020-11-05T05:34:51.219Z',
                size: 4096,
                populatedDate: '2020-12-13T18:10:38.000Z',
            },
        ];
        render((
            <I18nextProvider i18n={i18next}>
                <MockedProvider
                    addTypename={false}
                    mocks={[{
                        request: {
                            query: ls,
                            variables: { path: './' },
                        },
                        result: { data: { ls: data } },
                    }]}
                >
                    <FileList />
                </MockedProvider>
            </I18nextProvider>
        ));
        expect(screen.getByTestId('file-list-spinner')).toBeInTheDocument();
        expect(screen.queryByText('An error has occured')).not.toBeInTheDocument();
        expect(screen.queryByText('Name')).not.toBeInTheDocument();
        expect(screen.queryByText('Kind')).not.toBeInTheDocument();
        expect(screen.queryByText('Created Date')).not.toBeInTheDocument();
        expect(screen.queryByText('Size')).not.toBeInTheDocument();
        expect(screen.queryByText('file')).not.toBeInTheDocument();
        expect(screen.queryByText('folder')).not.toBeInTheDocument();
        expect(screen.queryByText('2 KB')).not.toBeInTheDocument();
        expect(screen.queryByText('4 KB')).not.toBeInTheDocument();
        expect(screen.queryByText('Wednesday, November 4, 2020 10:03 PM')).not.toBeInTheDocument();
        expect(screen.queryByText('Thursday, November 5, 2020 12:34 AM')).not.toBeInTheDocument();
        expect(screen.queryByText('File')).not.toBeInTheDocument();
        expect(screen.queryByText('Folder')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByTestId('file-list-spinner')).not.toBeInTheDocument();
            expect(screen.queryByText('An error has occured')).not.toBeInTheDocument();
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Kind')).toBeInTheDocument();
            expect(screen.getByText('Created Date')).toBeInTheDocument();
            expect(screen.getByText('Size')).toBeInTheDocument();
            expect(screen.getByText('file')).toBeInTheDocument();
            expect(screen.getByText('folder')).toBeInTheDocument();
            expect(screen.getByText('2 KB')).toBeInTheDocument();
            expect(screen.getByText('4 KB')).toBeInTheDocument();
            expect(screen.getByText('Wednesday, November 4, 2020 10:03 PM')).toBeInTheDocument();
            expect(screen.getByText('Thursday, November 5, 2020 12:34 AM')).toBeInTheDocument();
            expect(screen.getByText('File')).toBeInTheDocument();
            expect(screen.getByText('Folder')).toBeInTheDocument();
        });
    });

    test('render with error', async () => {
        render((
            <I18nextProvider i18n={i18next}>
                <MockedProvider
                    addTypename={false}
                    mocks={[{
                        request: {
                            query: ls,
                            variables: { path: './' },
                        },
                        result: { errors: [new GraphQLError('error')] },
                    }]}
                >
                    <FileList />
                </MockedProvider>
            </I18nextProvider>
        ));
        expect(screen.getByTestId('file-list-spinner')).toBeInTheDocument();
        expect(screen.queryByText('An error has occured')).not.toBeInTheDocument();
        expect(screen.queryByText('Name')).not.toBeInTheDocument();
        expect(screen.queryByText('Kind')).not.toBeInTheDocument();
        expect(screen.queryByText('Created Date')).not.toBeInTheDocument();
        expect(screen.queryByText('Size')).not.toBeInTheDocument();
        expect(screen.queryByText('file')).not.toBeInTheDocument();
        expect(screen.queryByText('folder')).not.toBeInTheDocument();
        expect(screen.queryByText('KB')).not.toBeInTheDocument();
        expect(screen.queryByText('AM')).not.toBeInTheDocument();
        expect(screen.queryByText('PM')).not.toBeInTheDocument();
        expect(screen.queryByText('File')).not.toBeInTheDocument();
        expect(screen.queryByText('Folder')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByText('An error has occured')).toBeInTheDocument();
            expect(screen.queryByTestId('file-list-spinner')).not.toBeInTheDocument();
            expect(screen.queryByText('Name')).not.toBeInTheDocument();
            expect(screen.queryByText('Kind')).not.toBeInTheDocument();
            expect(screen.queryByText('Created Date')).not.toBeInTheDocument();
            expect(screen.queryByText('Size')).not.toBeInTheDocument();
            expect(screen.queryByText('file')).not.toBeInTheDocument();
            expect(screen.queryByText('folder')).not.toBeInTheDocument();
            expect(screen.queryByText('KB')).not.toBeInTheDocument();
            expect(screen.queryByText('AM')).not.toBeInTheDocument();
            expect(screen.queryByText('PM')).not.toBeInTheDocument();
            expect(screen.queryByText('File')).not.toBeInTheDocument();
            expect(screen.queryByText('Folder')).not.toBeInTheDocument();
        });
    });

    test('if file kind is mapped to the extension of the file', async () => {
        const data: Record<string, unknown>[] = [
            {
                name: 'file.rb',
                path: './file.rb',
                extension: '.rb',
                isDirectory: false,
                parentDirectory: '.',
                createdDate: '2020-11-05T03:03:46.950Z',
                size: 2096,
                populatedDate: '2020-12-13T18:10:38.000Z',
            },
            {
                name: 'file.js',
                path: './file.js',
                extension: '.js',
                isDirectory: false,
                parentDirectory: '.',
                createdDate: '2020-11-05T05:34:51.219Z',
                size: 4096,
                populatedDate: '2020-12-13T18:10:38.000Z',
            },
            {
                name: 'file.ts',
                path: './file.ts',
                extension: '.ts',
                isDirectory: false,
                parentDirectory: '.',
                createdDate: '2020-11-05T05:34:51.219Z',
                size: 4096,
                populatedDate: '2020-12-13T18:10:38.000Z',
            },
            {
                name: 'file.py',
                path: './file.py',
                extension: '.py',
                isDirectory: false,
                parentDirectory: '.',
                createdDate: '2020-11-05T05:34:51.219Z',
                size: 4096,
                populatedDate: '2020-12-13T18:10:38.000Z',
            },
            {
                name: 'file.cpp',
                path: './file.cpp',
                extension: '.cpp',
                isDirectory: false,
                parentDirectory: '.',
                createdDate: '2020-11-05T05:34:51.219Z',
                size: 4096,
                populatedDate: '2020-12-13T18:10:38.000Z',
            },
            {
                name: 'file',
                path: './file',
                extension: null,
                isDirectory: false,
                parentDirectory: '.',
                createdDate: '2020-11-05T05:34:51.219Z',
                size: 4096,
                populatedDate: '2020-12-13T18:10:38.000Z',
            },
            {
                name: 'folder',
                path: './folder',
                extension: null,
                isDirectory: true,
                parentDirectory: '.',
                createdDate: '2020-11-05T05:34:51.219Z',
                size: 4096,
                populatedDate: '2020-12-13T18:10:38.000Z',
            },
        ];
        render((
            <I18nextProvider i18n={i18next}>
                <MockedProvider
                    addTypename={false}
                    mocks={[{
                        request: {
                            query: ls,
                            variables: { path: './' },
                        },
                        result: { data: { ls: data } },
                    }]}
                >
                    <FileList />
                </MockedProvider>
            </I18nextProvider>
        ));
        await waitFor(() => {
            expect(screen.getByText('File')).toBeInTheDocument();
            expect(screen.getByText('Folder')).toBeInTheDocument();
            expect(screen.getByText('TypeScript source file')).toBeInTheDocument();
            expect(screen.getByText('Python script file')).toBeInTheDocument();
            expect(screen.getByText('Ruby Script file')).toBeInTheDocument();
            expect(screen.getByText('C++ language source')).toBeInTheDocument();
        });
    });

    test('unknown file extension should return a Unknown type', async () => {
        const data: Record<string, unknown>[] = [
            {
                name: 'file.someunknownfileextensionthatidk',
                path: './file.someunknownfileextensionthatidk',
                extension: 'someunknownfileextensionthatidk',
                isDirectory: false,
                parentDirectory: '.',
                createdDate: '2020-11-05T03:03:46.950Z',
                size: 2096,
                populatedDate: '2020-12-13T18:10:38.000Z',
            },
        ];
        render((
            <I18nextProvider i18n={i18next}>
                <MockedProvider
                    addTypename={false}
                    mocks={[{
                        request: {
                            query: ls,
                            variables: { path: './' },
                        },
                        result: { data: { ls: data } },
                    }]}
                >
                    <FileList />
                </MockedProvider>
            </I18nextProvider>
        ));
        await waitFor(() => {
            expect(screen.getByText('Unknown')).toBeInTheDocument();
        });
    });

    test('if isDirectory attribute is the only thing determining if something is a file or folder', async () => {
        let data: Record<string, unknown>[] = [
            {
                name: 'file.rb',
                path: './file.rb',
                extension: 'rb',
                isDirectory: true,
                parentDirectory: '.',
                createdDate: '2020-11-05T03:03:46.950Z',
                size: 2096,
                populatedDate: '2020-12-13T18:10:38.000Z',
            },
        ];
        render((
            <I18nextProvider i18n={i18next}>
                <MockedProvider
                    addTypename={false}
                    mocks={[{
                        request: {
                            query: ls,
                            variables: { path: './' },
                        },
                        result: { data: { ls: data } },
                    }]}
                >
                    <FileList />
                </MockedProvider>
            </I18nextProvider>
        ));
        await waitFor(() => {
            expect(screen.queryByText('File')).not.toBeInTheDocument();
            expect(screen.getByText('Folder')).toBeInTheDocument();
        });
        cleanup();
        data = [
            {
                name: 'folder',
                path: './folder',
                extension: null,
                isDirectory: false,
                parentDirectory: '.',
                createdDate: '2020-11-05T03:03:46.950Z',
                size: 2096,
                populatedDate: '2020-12-13T18:10:38.000Z',
            },
        ];
        render((
            <I18nextProvider i18n={i18next}>
                <MockedProvider
                    addTypename={false}
                    mocks={[{
                        request: {
                            query: ls,
                            variables: { path: './' },
                        },
                        result: { data: { ls: data } },
                    }]}
                >
                    <FileList />
                </MockedProvider>
            </I18nextProvider>
        ));
        await waitFor(() => {
            expect(screen.queryByText('Folder')).not.toBeInTheDocument();
            expect(screen.getByText('File')).toBeInTheDocument();
        });
    });
});
