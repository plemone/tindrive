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
import { FileIconProps } from './FileIcon.d';

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
    const getIcon = (isDirectory, classes): React.ReactNode => {
        const Component = isDirectory ? FolderIcon : FileIconIcon;
        return (
            <Component
                className={clsx(classes.icon, { [classes.folderIcon]: isDirectory })}
                data-testid={`${isDirectory ? 'file-icon-folder-icon' : 'file-icon-file-icon'}`}
            />
        );
    };

    return name.length > characterLimit
        ? (
            <Tooltip title={name}>
                <IconButton
                    className={classes.button}
                    onClick={(): void => isDirectory && onClick(path)}
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
                className={classes.button}
                onClick={(): void => isDirectory && onClick(path)}
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
