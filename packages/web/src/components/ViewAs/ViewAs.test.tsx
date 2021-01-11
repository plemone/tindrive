/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { useWindowDimensions } from '../../hooks';
import commonEn from '../../translations/en/common.json';
import ViewAs from '.';

jest.mock('../../hooks', () => ({
    useWindowDimensions: jest.fn(() => ({
        width: 1024,
        height: 768,
    })),
}));

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe('ViewAs', () => {
    test('render', () => {
        const component = render(
            <I18nextProvider i18n={i18next}>
                <ViewAs
                    onClick={jest.fn()}
                    value="icons"
                />
            </I18nextProvider>,
        );
        expect(component.getByTestId('view-as')).toBeInTheDocument();
        expect(component.getByTestId('view-as-icons-button')).toBeInTheDocument();
        expect(component.getByTestId('view-as-list-button')).toBeInTheDocument();
        expect(component.getByTestId('view-as-columns-button')).toBeInTheDocument();
    });

    test('onClick', () => {
        const mockedOnClick = jest.fn();
        const component = render(
            <I18nextProvider i18n={i18next}>
                <ViewAs
                    onClick={mockedOnClick}
                    value="icons"
                />
            </I18nextProvider>,
        );
        fireEvent.click(component.getByTestId('view-as-icons-button'));
        expect(mockedOnClick).toHaveBeenCalledWith('icons');
        fireEvent.click(component.getByTestId('view-as-list-button'));
        expect(mockedOnClick).toHaveBeenCalledWith('list');
        fireEvent.click(component.getByTestId('view-as-columns-button'));
        expect(mockedOnClick).toHaveBeenCalledWith('columns');
    });

    test('if appropriate icons are highlighted when specific values are passed to the component', () => {
        let component = render(
            <I18nextProvider i18n={i18next}>
                <ViewAs
                    onClick={jest.fn()}
                    value="icons"
                />
            </I18nextProvider>,
        );
        expect(component.getByTestId('view-as-icons-button-icon')).toHaveClass('MuiSvgIcon-colorSecondary');
        expect(component.getByTestId('view-as-list-button-icon')).not.toHaveClass('MuiSvgIcon-colorSecondary');
        expect(component.getByTestId('view-as-columns-button-icon')).not.toHaveClass('MuiSvgIcon-colorSecondary');
        // The cleanup function needs to be called to unmount the component rendered above.
        cleanup();

        component = render(
            <I18nextProvider i18n={i18next}>
                <ViewAs
                    onClick={jest.fn()}
                    value="list"
                />
            </I18nextProvider>,
        );
        expect(component.getByTestId('view-as-icons-button-icon')).not.toHaveClass('MuiSvgIcon-colorSecondary');
        expect(component.getByTestId('view-as-list-button-icon')).toHaveClass('MuiSvgIcon-colorSecondary');
        expect(component.getByTestId('view-as-columns-button-icon')).not.toHaveClass('MuiSvgIcon-colorSecondary');
        // The cleanup function needs to be called to unmount the component rendered above.
        cleanup();

        component = render(
            <I18nextProvider i18n={i18next}>
                <ViewAs
                    onClick={jest.fn()}
                    value="columns"
                />
            </I18nextProvider>,
        );
        expect(component.getByTestId('view-as-icons-button-icon')).not.toHaveClass('MuiSvgIcon-colorSecondary');
        expect(component.getByTestId('view-as-list-button-icon')).not.toHaveClass('MuiSvgIcon-colorSecondary');
        expect(component.getByTestId('view-as-columns-button-icon')).toHaveClass('MuiSvgIcon-colorSecondary');
    });

    test('responsiveness', () => {
        // @ts-ignore
        useWindowDimensions.mockImplementation(() => ({
            width: 360,
            height: 640,
        }));
        const component = render(
            <I18nextProvider i18n={i18next}>
                <ViewAs
                    onClick={jest.fn()}
                    value="columns"
                />
            </I18nextProvider>,
        );
        expect(component.getByTestId('view-as-more-vert-button')).toBeInTheDocument();
        expect(component.getByTestId('view-as-menu')).toBeInTheDocument();
        [
            'icons',
            'list',
            'columns',
        ].forEach(value => expect(component.getByTestId(`view-as-menu-option-${value}`)));
    });
});
