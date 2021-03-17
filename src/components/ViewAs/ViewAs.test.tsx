/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {
    render,
    cleanup,
    fireEvent,
    screen,
    waitFor,
} from '@testing-library/react';
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
    test('onClick', () => {
        const mockedOnClick = jest.fn();
        render(
            <I18nextProvider i18n={i18next}>
                <ViewAs
                    onClick={mockedOnClick}
                    value="icons"
                />
            </I18nextProvider>,
        );
        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
            fireEvent.click(button);
            expect(mockedOnClick).toHaveBeenCalledWith('icons');
        });
    });

    test('if appropriate icons are highlighted when specific values are passed to the screen', () => {
        render(
            <I18nextProvider i18n={i18next}>
                <ViewAs
                    onClick={jest.fn()}
                    value="icons"
                />
            </I18nextProvider>,
        );
        let buttons = screen.getAllByRole('button');
        expect(buttons[0].firstChild.firstChild).toHaveClass('MuiSvgIcon-colorSecondary');
        expect(buttons[1].firstChild.firstChild).not.toHaveClass('MuiSvgIcon-colorSecondary');
        expect(buttons[2].firstChild.firstChild).not.toHaveClass('MuiSvgIcon-colorSecondary');
        cleanup();

        render(
            <I18nextProvider i18n={i18next}>
                <ViewAs
                    onClick={jest.fn()}
                    value="list"
                />
            </I18nextProvider>,
        );
        buttons = screen.getAllByRole('button');
        expect(buttons[0].firstChild.firstChild).not.toHaveClass('MuiSvgIcon-colorSecondary');
        expect(buttons[1].firstChild.firstChild).toHaveClass('MuiSvgIcon-colorSecondary');
        expect(buttons[2].firstChild.firstChild).not.toHaveClass('MuiSvgIcon-colorSecondary');
        cleanup();

        render(
            <I18nextProvider i18n={i18next}>
                <ViewAs
                    onClick={jest.fn()}
                    value="columns"
                />
            </I18nextProvider>,
        );
        buttons = screen.getAllByRole('button');
        expect(buttons[0].firstChild.firstChild).not.toHaveClass('MuiSvgIcon-colorSecondary');
        expect(buttons[1].firstChild.firstChild).not.toHaveClass('MuiSvgIcon-colorSecondary');
        expect(buttons[2].firstChild.firstChild).toHaveClass('MuiSvgIcon-colorSecondary');
    });

    test('responsiveness', async () => {
        // @ts-ignore
        useWindowDimensions.mockImplementation(() => ({
            width: 360,
            height: 640,
        }));
        render(
            <I18nextProvider i18n={i18next}>
                <ViewAs
                    onClick={jest.fn()}
                    value="columns"
                    data-testid="view-as-menu"
                />
            </I18nextProvider>,
        );
        jest.useFakeTimers();
        fireEvent.click(screen.getByRole('button'));
        await waitFor(() => jest.advanceTimersByTime(100));
        expect(screen.getByText('As icons')).toBeInTheDocument();
        expect(screen.getByText('As list')).toBeInTheDocument();
        expect(screen.getByText('As columns')).toBeInTheDocument();
    });
});
