import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    IconButton,
} from '@material-ui/core';
import {
    Delete as RemoveIcon,
    Edit as RenameIcon,
} from '@material-ui/icons';
import ActionTrayContext from './ActionTrayContext';
import {
    ActionTrayProps,
    MenuItemType,
} from './ActionTray.d';

const useStyles = makeStyles({
    root: {
        position: 'fixed',
        bottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'auto',
        width: '100%',
    },
    action: {},
});

const ActionTrayProvider: React.FC<ActionTrayProps> = ({ children }) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        open: false,
        items: [],
    });

    const openActionTray = (_event: React.MouseEvent, items: MenuItemType[]) => {
        setState(() => ({
            open: true,
            items,
        }));
    };

    const closeActionTray = () => {
        setState(prevState => ({
            ...prevState,
            open: false,
        }));
    };

    const iconMapByName = {
        remove: <RemoveIcon />,
        rename: <RenameIcon />,
    };

    return (
        <ActionTrayContext.Provider value={{ openActionTray, closeActionTray }}>
            {children}
            {state.open && (
                <Box className={classes.root}>
                    {state.items.map((item: MenuItemType) => (<IconButton key={`action-tray-item-${item.name}`}>{iconMapByName[item.name]}</IconButton>))}
                </Box>
            )}
        </ActionTrayContext.Provider>
    );
};

export default ActionTrayProvider;
