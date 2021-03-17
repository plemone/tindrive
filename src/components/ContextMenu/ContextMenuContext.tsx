import React from 'react';
import { ContextMenuValue } from './ContextMenu.d';

export default React.createContext({ openContextMenu: () => {} } as ContextMenuValue);
