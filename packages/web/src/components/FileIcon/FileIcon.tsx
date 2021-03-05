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
        borderRadius: '5%',
        '& .MuiTouchRipple-root span': {
            backgroundColor: `${theme.palette.grey[500]}!important`,
            opacity: 0.3,
        },
    },
}));

const FileIcon: React.FC<FileIconProps> = ({
    isDirectory,
    name,
    onClick,
    path,
    'data-testid': dataTestid,
}) => {
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

    const onDoubleClick = (): void => isDirectory && onClick(path);

    return name.length > characterLimit
        ? (
            <Tooltip title={name}>
                <IconButton
                    onContextMenu={event => contextMenu.openContextMenu(event, isDirectory ? folderActions : fileActions)}
                    className={classes.button}
                    onDoubleClick={onDoubleClick}
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
                className={classes.button}
                onDoubleClick={onDoubleClick}
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
