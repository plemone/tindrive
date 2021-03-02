import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ConfirmationProviderProps } from './Confirmation.d';
import ConfirmationContext from './ConfirmationContext';

const ConfirmationProvider: React.FC<ConfirmationProviderProps> = ({ children }) => {
    const [t] = useTranslation('common');
    const [state, setState] = React.useState({
        open: false,
        title: '',
        msg: '',
        onConfirm: () => {},
    });

    const openConfirmation = (title: string, msg: string, onConfirm: () => void) => {
        setState(prevState => ({
            ...prevState,
            title,
            msg,
            onConfirm,
            open: true,
        }));
    };

    const closeConfirmation = () => {
        setState(prevState => ({
            ...prevState,
            open: false,
        }));
    };

    return (
        <ConfirmationContext.Provider value={{ openConfirmation, closeConfirmation }}>
            {children}
            <Dialog
                open={state.open}
                onClose={closeConfirmation}
            >
                <DialogTitle>{state.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{state.msg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => state.onConfirm()}
                        autoFocus
                    >
                        {t('confirmation.ok')}
                    </Button>
                    <Button onClick={closeConfirmation}>
                        {t('confirmation.cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        </ConfirmationContext.Provider>
    );
};

export default ConfirmationProvider;
