import React from 'react';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import commonEn from '../../translations/en/common.json';
import ViewAs from '.';

i18next.init({ interpolation: { escapeValue: false } });

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe(ViewAs, () => {
    test('render', () => {
        render(
            <I18nextProvider i18n={i18next}>
                <ViewAs
                    onClick={jest.fn()}
                    value='As icons'
                />
            </I18nextProvider>,
        );
    });
});
