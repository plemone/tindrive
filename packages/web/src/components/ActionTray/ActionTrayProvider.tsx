import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    BottomNavigation,
    BottomNavigationAction,
} from '@material-ui/core';
import ActionTrayContext from './ActionTrayContext';
import { ActionTrayProps, MenuItemType } from './ActionTray.d';

const useStyles = makeStyles({
    root: {
        position: 'fixed',
        bottom: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'auto',
        width: '100%',
    },
    label: {
        fontSize: 12,
        color: 'white !important',
    },
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

    return (
        <ActionTrayContext.Provider value={{ openActionTray, closeActionTray }}>
            {children}
            {state.open && (
                <div className={classes.root}>
                    <BottomNavigation showLabels>
                        {state.items.map((item: MenuItemType) => (
                            <BottomNavigationAction
                                key={`action-tray-item-${item.name}`}
                                label={item.title}
                                value={item.name}
                                className={classes.label}
                                onClick={item.handler}
                            />
                        ))}
                    </BottomNavigation>
                </div>
            )}
        </ActionTrayContext.Provider>
    );
};

export default ActionTrayProvider;
