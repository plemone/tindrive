import { useTranslation } from 'react-i18next';
import { useConfirmation } from '../components/Confirmation';

export default function useFileActions(): {
    name: string;
    title: string;
    handler: (e: React.SyntheticEvent) => void
}[] {
    const [t] = useTranslation('common');
    const confirmation = useConfirmation();

    const moveToTrash = () => {
        confirmation.openConfirmation(t('fileActions.confirmDeleteTitle'), t('fileActions.confirmDeleteMsg'), () => {
            confirmation.closeConfirmation();
        });
    };

    return [
        {
            name: 'moveToTrash',
            title: 'Move to Trash',
            handler: moveToTrash,
        },
    ];
}
