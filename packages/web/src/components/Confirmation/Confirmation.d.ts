import { StandardProps } from '../../index.d';

export type ConfirmationProviderProps = StandardProps;

export interface ConfirmationValue {
    openConfirmation: (title: string, content: string, onConfirm: () => void) => void,
    closeConfirmation: () => void
}
