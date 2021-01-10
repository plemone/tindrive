/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import * as nextRouter from 'next/router';
import commonEn from '../../translations/en/common.json';
import FileColumns from '.';
import { ls } from '../../queries';

// @ts-ignore
nextRouter.useRouter = jest.fn();
// @ts-ignore
nextRouter.useRouter.mockImplementation(() => ({
    events: {
        on: jest.fn(),
        off: jest.fn(),
    },
    query: { path: './folder-a/folder-b' },
}));

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe(FileColumns, () => {
    test('if number of columns rendered correspond to the path', async () => {
        const path = './folder-a/folder-b';
        const data: {}[] = [];
        // @ts-ignore
        nextRouter.useRouter.mockImplementation(() => ({
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
            query: { path },
        }));
        const component = render((
            <I18nextProvider i18n={i18next}>
                <MockedProvider
                    addTypename={false}
                    mocks={[{
                        request: {
                            query: ls,
                            variables: { path },
                        },
                        result: { data: { ls: data } },
                    }]}
                >
                    <FileColumns />
                </MockedProvider>
            </I18nextProvider>
        ));
        const pathSegments = path.split('/').filter(path => !!path);
        for (let i = 0; i < pathSegments.length; ++i) {
            expect(component.getByTestId(`file-column-${i}`)).toBeInTheDocument();
        }
        expect(component.queryByTestId('file-column-3')).not.toBeInTheDocument();
    });
});
