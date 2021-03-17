import React from 'react';
import { ContextMenuValue } from './ContextMenu.d';
import ContextMenuContext from './ContextMenuContext';

export default function useContextMenu(): ContextMenuValue {
    return React.useContext(ContextMenuContext);
}
