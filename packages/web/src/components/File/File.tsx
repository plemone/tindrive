import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Tooltip,
    IconButton,
} from '@material-ui/core';
import {
    InsertDriveFile as FileIcon,
    Folder as FolderIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import { FileProps } from './File.d';

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
    button: { borderRadius: '5%' },
}));

const File: React.FC<FileProps> = ({
    isDirectory,
    name,
    onClick,
    path,
    'data-testid': dataTestid,
}) => {
    const characterLimit = 20;
    const classes = useStyles();
    const getIcon = (isDirectory, classes): React.ReactNode => {
        const Component = isDirectory ? FolderIcon : FileIcon;
        return (
            <Component
                className={clsx(classes.icon, { [classes.folderIcon]: isDirectory })}
                data-testid={`${isDirectory ? 'folder-icon' : 'file-icon'}`}
            />
        );
    };

    return name.length > characterLimit
        ? (
            <Tooltip
                data-testid='file-tooltip'
                title={name}
            >
                <IconButton
                    className={classes.button}
                    onClick={(): void => isDirectory && onClick(path)}
                >
                    <div
                        className={classes.root}
                        data-testid={dataTestid || `file-${path}`}
                    >
                        {getIcon(isDirectory, classes)}
                        {`${name.slice(0, characterLimit)}...`}
                    </div>
                </IconButton>
            </Tooltip>
        )
        : (
            <IconButton
                className={classes.button}
                onClick={(): void => isDirectory && onClick(path)}
            >
                <div
                    className={classes.root}
                    data-testid={dataTestid || `file-${path}`}
                >
                    {getIcon(isDirectory, classes)}
                    {name}
                </div>
            </IconButton>
        );
};

export default File;
