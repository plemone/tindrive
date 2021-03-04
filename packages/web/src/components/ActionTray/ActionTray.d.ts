import React from 'react';
import { StandardProps } from '../../index.d';

export type ActionTrayProps = StandardProps;

export interface MenuItemType {
    name: string;
    title: string;
    handler: (e: React.SyntheticEvent) => void
}

export interface ActionTrayValue {
    openActionTray: (event: React.SyntheticEvent, items) => void;
    closeActionTray: (event: React.SyntheticEvent) => void;
}
