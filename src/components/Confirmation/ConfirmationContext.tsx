import React from 'react';
import { ConfirmationValue } from './Confirmation.d';

export default React.createContext({
    openConfirmation: () => {},
    closeConfirmation: () => {},
} as ConfirmationValue);
