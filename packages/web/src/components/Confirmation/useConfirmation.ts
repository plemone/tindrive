import React from 'react';
import { ConfirmationValue } from './Confirmation.d';
import ConfirmationContext from './ConfirmationContext';

export default function useConfirmation(): ConfirmationValue {
    return React.useContext(ConfirmationContext);
}
