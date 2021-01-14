/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {
    cleanup,
    render,
    waitFor,
    screen,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import * as nextRouter from 'next/router';
import commonEn from '../../translations/en/common.json';
import { ls } from '../../queries';
import FileColumn from '.';

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

describe('FileColumn', () => {
    test('render', async () => {
        const data: Record<string, unknown>[] = [
            {
                name: 'file',
                path: './file',
                extension: null,
                isDirectory: false,
                parentDirectory: '.',
                createdDate: '2020-11-05T03:03:46.950Z',
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
                    <FileColumn
                        index={1}
                        path="./"
                    />
                </MockedProvider>
            </I18nextProvider>
        ));
        expect(screen.getByTestId('file-column-spinner')).toBeInTheDocument();
        expect(screen.queryByText('An error has occured')).not.toBeInTheDocument();
        expect(screen.queryByText('file')).toBeFalsy();
        expect(screen.queryByText('folder')).toBeFalsy();
        expect(screen.queryByTestId('file-column-folder-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('file-column-file-icon')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByTestId('file-column-spinner')).not.toBeInTheDocument();
            expect(screen.queryByText('An error has occured')).not.toBeInTheDocument();
            expect(screen.getByText('file')).toBeTruthy();
            expect(screen.getByText('folder')).toBeTruthy();
            expect(screen.getByTestId('file-column-folder-icon')).toBeInTheDocument();
            expect(screen.getByTestId('file-column-file-icon')).toBeInTheDocument();
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
                    <FileColumn
                        index={1}
                        path="./"
                    />
                </MockedProvider>
            </I18nextProvider>
        ));
        expect(screen.getByTestId('file-column-spinner')).toBeInTheDocument();
        expect(screen.queryByText('An error has occured')).not.toBeInTheDocument();
        expect(screen.queryByText('file')).toBeFalsy();
        expect(screen.queryByText('folder')).toBeFalsy();
        expect(screen.queryByTestId('file-column-folder-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('file-column-file-icon')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByTestId('file-column-spinner')).not.toBeInTheDocument();
            expect(screen.queryByText('An error has occured')).toBeInTheDocument();
            expect(screen.queryByText('file')).toBeFalsy();
            expect(screen.queryByText('folder')).toBeFalsy();
            expect(screen.queryByTestId('file-column-folder-icon')).not.toBeInTheDocument();
            expect(screen.queryByTestId('file-column-file-icon')).not.toBeInTheDocument();
        });
    });

    test('border props', () => {
        const data: Record<string, unknown>[] = [
            {
                name: 'file',
                path: './file',
                extension: null,
                isDirectory: false,
                parentDirectory: '.',
                createdDate: '2020-11-05T03:03:46.950Z',
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
                    <FileColumn
                        data-testid="file-column"
                        index={1}
                        path="./"
                    />
                </MockedProvider>
            </I18nextProvider>
        ));
        expect(screen.getByTestId('file-column')).not.toHaveStyle('border-right: 1px solid');
        cleanup();
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
                    <FileColumn
                        data-testid="file-column"
                        index={1}
                        path="./"
                    />
                </MockedProvider>
            </I18nextProvider>
        ));
        expect(screen.getByTestId('file-column')).not.toHaveStyle('border-right: 1px solid');
    });

    test('selected list', async () => {
        // @ts-ignore
        nextRouter.useRouter.mockImplementation(() => ({
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
            query: { path: './folder' },
        }));
        const data: Record<string, unknown>[] = [
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
                            variables: { path: './folder' },
                        },
                        result: { data: { ls: data } },
                    }]}
                >
                    <FileColumn
                        index={1}
                        path="./folder"
                    />
                </MockedProvider>
            </I18nextProvider>
        ));
        await waitFor(() => {
            expect(screen.getByTestId('file-column-folder-0')).toHaveClass('Mui-selected');
        });
    });
});
