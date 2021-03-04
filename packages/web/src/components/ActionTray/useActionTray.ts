import React from 'react';
import { ActionTrayValue } from './ActionTray.d';
import ActionTrayContext from './ActionTrayContext';

export default function useActionTray(): ActionTrayValue {
    return React.useContext(ActionTrayContext);
}
