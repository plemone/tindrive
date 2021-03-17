import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
    Tooltip,
    IconButton,
    Box,
} from '@material-ui/core';
import {
    InsertDriveFile as FileIconIcon,
    Folder as FolderIcon,
} from '@material-ui/icons';
import { useContextMenu } from '../ContextMenu';
import { useFolderActions, useFileActions } from '../../hooks';
import { FileIconProps } from './FileIcon.d';
import { Classes } from '../../index.d';

export const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        fontSize: 14,
        width: 80,
        margin: theme.spacing(1),
        wordBreak: 'break-word',
    },
    icon: {
        width: 50,
        height: 50,
    },
    folderIcon: { fill: '#FBD405' },
    '@media (max-width: 640px)': {
        icon: {
            width: 35,
            height: 35,
        },
    },
    button: {
        borderRadius: '0%',
    },
    selected: {
        textDecoration: 'none',
        backgroundColor: 'rgba(148, 168, 245, 0.08)',
    },
}));

const FileIcon: React.FC<FileIconProps> = ({
    isDirectory,
    name,
    onClick: onClickProps,
    path,
    'data-testid': dataTestid,
}) => {
    const [selected, setSelected] = React.useState(false);
    const characterLimit = 30;
    const classes = useStyles();
    const contextMenu = useContextMenu();
    const fileActions = useFileActions();
    const folderActions = useFolderActions();

    const getIcon = (isDirectory: boolean, classes: Classes): React.ReactNode => {
        const Component = isDirectory ? FolderIcon : FileIconIcon;
        return (
            <Component
                className={clsx(classes.icon, { [classes.folderIcon]: isDirectory })}
                data-testid={`${isDirectory ? 'file-icon-folder-icon' : 'file-icon-file-icon'}`}
            />
        );
    };

    const onDoubleClick = (): void => isDirectory && onClickProps(path);

    const onClick = (event: React.MouseEvent) => {
        if (event.ctrlKey) {
            setSelected(!selected);
        }
    };

    return name.length > characterLimit
        ? (
            <Tooltip title={name}>
                <IconButton
                    onContextMenu={event => contextMenu.openContextMenu(event, isDirectory ? folderActions : fileActions)}
                    className={clsx(classes.button, { [classes.selected]: selected })}
                    onDoubleClick={onDoubleClick}
                    onClick={onClick}
                    disableRipple
                >
                    <Box
                        className={classes.root}
                        data-testid={dataTestid}
                    >
                        {getIcon(isDirectory, classes)}
                        {`${name.slice(0, characterLimit)}...`}
                    </Box>
                </IconButton>
            </Tooltip>
        )
        : (
            <IconButton
                onContextMenu={event => contextMenu.openContextMenu(event, isDirectory ? folderActions : fileActions)}
                className={clsx(classes.button, { [classes.selected]: selected })}
                onDoubleClick={onDoubleClick}
                onClick={onClick}
                disableRipple
            >
                <Box
                    className={classes.root}
                    data-testid={dataTestid}
                >
                    {getIcon(isDirectory, classes)}
                    {name}
                </Box>
            </IconButton>
        );
};

export default FileIcon;
