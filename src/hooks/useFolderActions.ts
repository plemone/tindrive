import { useTranslation } from 'react-i18next';
import { useConfirmation } from '../components/Confirmation';

export default function useFolderActions(): {
    name: string;
    title: string;
    handler: (e: React.SyntheticEvent) => void
}[] {
    const [t] = useTranslation('common');
    const confirmation = useConfirmation();

    const remove = () => {
        confirmation.openConfirmation(t('folderActions.confirmDeleteTitle'), t('folderActions.confirmDeleteMsg'), () => {
            confirmation.closeConfirmation();
        });
    };

    const rename = () => {};

    const cut = () => {};

    const copy = () => {};

    return [
        {
            name: 'remove',
            title: 'Remove',
            handler: remove,
        },
        {
            name: 'rename',
            title: 'Rename',
            handler: rename,
        },
        {
            name: 'cut',
            title: 'Cut',
            handler: cut,
        },
        {
            name: 'copy',
            title: 'Copy',
            handler: copy,
        },
    ];
}
