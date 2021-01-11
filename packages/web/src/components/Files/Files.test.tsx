import React from 'react';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import commonEn from '../../translations/en/common.json';
import Files from '.';

jest.mock('next/router', () => ({
    useRouter: (): Record<string, unknown> => ({
        events: {
            on: jest.fn(),
            off: jest.fn(),
        },
        query: { path: './' },
    }),
}));

jest.mock('../FileIcons', () => ({
    __esModule: true,
    default: (): React.ReactNode => <>Should render icons</>,
}));

jest.mock('../FileList', () => ({
    __esModule: true,
    default: (): React.ReactNode => <>Should render list</>,
}));

jest.mock('../FileColumns', () => ({
    __esModule: true,
    default: (): React.ReactNode => <>Should render columns</>,
}));

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe('Files', () => {
    test('render', async () => {
        const component = render(
            <I18nextProvider i18n={i18next}>
                <Files />
            </I18nextProvider>,
        );
        expect(component.getByTestId('files-header')).toBeInTheDocument();
        expect(component.getByTestId('files-path-breadcrumbs')).toBeInTheDocument();
        expect(component.getByTestId('files-view-as')).toBeInTheDocument();
    });

    test('render with default viewAs value', async () => {
        const component = render(
            <I18nextProvider i18n={i18next}>
                <Files />
            </I18nextProvider>,
        );
        expect(component.getByText('Should render icons')).toBeInTheDocument();
    });

    test('render with all values', async () => {
        ['icons', 'list', 'columns'].forEach(item => {
            const component = render(
                <I18nextProvider i18n={i18next}>
                    <Files viewAs={item} />
                </I18nextProvider>,
            );
            expect(component.getByText(`Should render ${item}`)).toBeInTheDocument();
        });
    });
});
