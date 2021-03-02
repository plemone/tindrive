/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {
    screen,
    render,
    fireEvent,
    waitFor,
} from '@testing-library/react';
import { Button } from '@material-ui/core';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { ConfirmationProvider, useConfirmation } from '.';
import commonEn from '../../translations/en/common.json';

// @ts-ignore
i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe('ContextMenu', () => {
    const onConfirm = jest.fn();
    const ShowConfirmation: React.FC = () => {
        const { openConfirmation, closeConfirmation } = useConfirmation();
        return (
            <>
                <Button onClick={() => {
                    openConfirmation('Please Confirm', 'Hello World?', onConfirm);
                }}
                >
                    Open Confirmation
                </Button>
                <Button onClick={closeConfirmation}>
                    Close Confirmation
                </Button>
            </>
        );
    };

    beforeEach(() => {
        render(
            <I18nextProvider i18n={i18next}>
                <ConfirmationProvider>
                    <ShowConfirmation />
                </ConfirmationProvider>
            </I18nextProvider>,
        );
    });

    test('if no content is shown if confirmation is not opened', async () => {
        expect(screen.queryByText('Please Confirm')).toBeFalsy();
        expect(screen.queryByText('Hello World?')).toBeFalsy();
    });

    test('if the necessary content is shown once you open the confirmation button', async () => {
        await waitFor(() => {
            fireEvent.click(screen.getByText('Open Confirmation'));
        });
        expect(screen.getByText('Please Confirm')).toBeInTheDocument();
        expect(screen.getByText('Hello World?')).toBeInTheDocument();
    });

    test('if the necessary content dissapears if the close confirmation button is pressed', async () => {
        await waitFor(() => {
            fireEvent.click(screen.getByText('Open Confirmation'));
        });
        expect(screen.getByText('Please Confirm')).toBeInTheDocument();
        expect(screen.getByText('Hello World?')).toBeInTheDocument();
        await waitFor(() => {
            fireEvent.click(screen.getByText('Close Confirmation'));
        });
        expect(screen.queryByText('Please Confirm')).toBeFalsy();
        expect(screen.queryByText('Hello World?')).toBeFalsy();
    });

    test('if onConfirm function gets invoked when you click the okay button', async () => {
        await waitFor(() => {
            fireEvent.click(screen.getByText('Open Confirmation'));
        });
        await waitFor(() => {
            fireEvent.click(screen.getByText('Ok'));
        });
        expect(onConfirm.mock.calls.length).toBe(1);
    });
});
