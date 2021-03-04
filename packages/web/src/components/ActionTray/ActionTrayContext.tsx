import React from 'react';
import { ActionTrayValue } from './ActionTray.d';

export default React.createContext({
    openActionTray: () => {},
    closeActionTray: () => {},
} as ActionTrayValue);
