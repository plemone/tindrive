/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
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
        const component = render((
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
        expect(component.getByTestId('file-column-spinner')).toBeInTheDocument();
        expect(component.getByTestId('file-column')).toBeInTheDocument();
        expect(component.queryByText('An error has occured')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(component.queryByTestId('file-column-spinner')).not.toBeInTheDocument();
            expect(component.queryByTestId('file-column-list')).toBeInTheDocument();
            expect(component.queryByText('An error has occured')).not.toBeInTheDocument();
            for (let index = 0; index < data.length; ++index) {
                expect(component.getByTestId(`file-column-list-item-${index}`)).toBeInTheDocument();
                expect(component.getByTestId(`file-column-list-item-content-${index}`)).toBeInTheDocument();
                expect(component.getByTestId(`file-column-list-item-content-name-${index}`)).toBeInTheDocument();
            }
        });
    });

    test('render with error', async () => {
        const component = render((
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
        expect(component.getByTestId('file-column-spinner')).toBeInTheDocument();
        expect(component.getByTestId('file-column')).toBeInTheDocument();
        expect(component.queryByText('An error has occured')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(component.queryByTestId('file-column-spinner')).not.toBeInTheDocument();
            expect(component.queryByTestId('file-column-list')).not.toBeInTheDocument();
            expect(component.queryByText('An error has occured')).toBeInTheDocument();
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
        let component = render((
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
        expect(component.getByTestId('file-column')).not.toHaveStyle('border-right: 1px solid');
        cleanup();
        component = render((
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
        expect(component.getByTestId('file-column')).not.toHaveStyle('border-right: 1px solid');
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
        const component = render((
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
            expect(component.getByTestId('file-column-list-item-0')).toHaveClass('Mui-selected');
        });
    });
});
