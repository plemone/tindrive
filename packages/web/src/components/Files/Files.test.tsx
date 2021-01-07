import React from 'react';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import commonEn from '../../translations/en/common.json';
import Files from '.';

jest.mock('next/router', () => ({
    useRouter: (): {} => ({
        events: {
            on: jest.fn(),
            off: jest.fn(),
        },
        query: { path: './' },
    }),
}));

jest.mock('../FileIcons', () => ({
    __esModule: true,
    default: (): React.ReactNode => <></>,
}));

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe(Files, () => {
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
});
