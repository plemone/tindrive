import { StandardProps } from '../../index.d';

export type ContextMenuProviderProps = StandardProps;

export interface MenuItemType {
    name: string;
    title: string;
    handler: (e: React.SyntheticEvent) => void
}

export interface ContextMenuValue {
    openContextMenu: (this: void, event: React.MouseEvent, items: MenuItemType[]) => void;
}
