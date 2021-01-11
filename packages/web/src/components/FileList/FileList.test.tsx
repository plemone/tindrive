/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
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
                    <FileList />
                </MockedProvider>
            </I18nextProvider>
        ));
        expect(component.getByTestId('file-list-spinner')).toBeInTheDocument();
        expect(component.queryByText('An error has occured')).not.toBeInTheDocument();
        expect(component.getByTestId('file-list')).toBeInTheDocument();
        await waitFor(() => {
            expect(component.queryByTestId('file-list-spinner')).not.toBeInTheDocument();
            expect(component.queryByText('An error has occured')).not.toBeInTheDocument();
            expect(component.queryByTestId('file-list')).toBeInTheDocument();
            expect(component.queryByTestId('file-list-table')).toBeInTheDocument();
            expect(component.queryByTestId('file-list-table-header')).toBeInTheDocument();
            expect(component.queryByTestId('file-list-table-header-name')).toBeInTheDocument();
            expect(component.queryByTestId('file-list-table-header-kind')).toBeInTheDocument();
            expect(component.queryByTestId('file-list-table-header-created-date')).toBeInTheDocument();
            expect(component.queryByTestId('file-list-table-header-size')).toBeInTheDocument();
            expect(component.queryByTestId('file-list-table-content')).toBeInTheDocument();
            for (let index = 0; index < data.length; ++index) {
                expect(component.getByTestId(`file-list-table-row-${index}`)).toBeInTheDocument();
                expect(component.getByTestId(`file-list-table-row-${index}-name`)).toBeInTheDocument();
                expect(component.getByTestId(`file-list-table-row-${index}-extension`)).toBeInTheDocument();
                expect(component.getByTestId(`file-list-table-row-${index}-created-date`)).toBeInTheDocument();
                expect(component.getByTestId(`file-list-table-row-${index}-size`)).toBeInTheDocument();
            }
            expect(component.getByTestId('file-list-table-item-file-0')).toBeInTheDocument();
            expect(component.getByTestId('file-list-table-item-folder-1')).toBeInTheDocument();
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
                    <FileList />
                </MockedProvider>
            </I18nextProvider>
        ));
        expect(component.getByTestId('file-list-spinner')).toBeInTheDocument();
        expect(component.queryByTestId('file-list')).toBeInTheDocument();
        expect(component.queryByText('An error has occured')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(component.queryByTestId('file-list-spinner')).not.toBeInTheDocument();
            expect(component.queryByTestId('file-list')).toBeInTheDocument();
            expect(component.queryByTestId('file-list-table')).not.toBeInTheDocument();
            expect(component.queryByTestId('file-list-table-header')).not.toBeInTheDocument();
            expect(component.queryByTestId('file-list-table-header-name')).not.toBeInTheDocument();
            expect(component.queryByTestId('file-list-table-header-kind')).not.toBeInTheDocument();
            expect(component.queryByTestId('file-list-table-header-created-date')).not.toBeInTheDocument();
            expect(component.queryByTestId('file-list-table-header-size')).not.toBeInTheDocument();
            expect(component.queryByTestId('file-list-table-content')).not.toBeInTheDocument();
            expect(component.queryByText('An error has occured')).toBeInTheDocument();
        });
    });
});
