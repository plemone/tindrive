import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import commonEn from '../../translations/en/common.json';
import { ls } from '../../queries';
import FileIcons from '.';

jest.mock('next/router', () => ({
    useRouter: (): Record<string, unknown> => ({
        events: {
            on: jest.fn(),
            off: jest.fn(),
        },
        query: { path: './' },
    }),
}));

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe('FileIcons', () => {
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
                    <FileIcons />
                </MockedProvider>
            </I18nextProvider>
        ));
        expect(screen.getByTestId('file-icons-spinner')).toBeInTheDocument();
        expect(screen.queryByText('An error has occured')).not.toBeInTheDocument();
        expect(screen.queryByText('folder')).not.toBeInTheDocument();
        expect(screen.queryByText('file')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByTestId('file-icons-spinner')).not.toBeInTheDocument();
            expect(screen.queryByText('An error has occured')).not.toBeInTheDocument();
            expect(screen.queryByText('folder')).toBeInTheDocument();
            expect(screen.queryByText('file')).toBeInTheDocument();
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
                    <FileIcons />
                </MockedProvider>
            </I18nextProvider>
        ));
        expect(screen.getByTestId('file-icons-spinner')).toBeInTheDocument();
        expect(screen.queryByText('An error has occured')).not.toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByTestId('file-icons-spinner')).not.toBeInTheDocument();
            expect(screen.queryByText('An error has occured')).toBeInTheDocument();
        });
    });
});
