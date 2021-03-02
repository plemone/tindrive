import React from 'react';
import {
    Menu,
    MenuItem,
} from '@material-ui/core';
import { ContextMenuProviderProps, MenuItemType } from './ContextMenu.d';
import ContextMenuContext from './ContextMenuContext';

const ContextMenuProvider: React.FC<ContextMenuProviderProps> = ({ children }) => {
    const initialState = {
        mouseX: null,
        mouseY: null,
        items: [],
    };
    const [state, setState] = React.useState(initialState);

    const openContextMenu = (event: React.MouseEvent, items: MenuItemType[]) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX + 4,
            mouseY: event.clientY,
            items,
        });
    };

    const onClose = () => {
        setState(previousState => ({
            ...previousState,
            mouseX: null,
            mouseY: null,
        }));
    };

    return (
        <ContextMenuContext.Provider value={{ openContextMenu }}>
            {children}
            <Menu
                keepMounted
                open={state.mouseY !== null}
                onClose={onClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    state.mouseY !== null && state.mouseX !== null
                        ? {
                            top: state.mouseY,
                            left: state.mouseX,
                        }
                        : undefined
                }
            >
                {state.items.map(item => (
                    <MenuItem
                        key={`menu-item-${item.name}`}
                        onClick={async (e: React.SyntheticEvent) => {
                            await item.handler(e);
                            onClose();
                        }}
                    >
                        {item.title}
                    </MenuItem>
                ))}
            </Menu>
        </ContextMenuContext.Provider>
    );
};

export default ContextMenuProvider;
