import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import {
    InsertDriveFile as FileIcon,
    Folder as FolderIcon,
} from '@material-ui/icons';
import { FileProps } from './File.d';

export const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        fontSize: 14,
        width: 60,
        margin: theme.spacing(1),
        wordBreak: 'break-word',
        textOverflow: 'ellipsis',
    },
    icon: {
        width: 50,
        height: 50,
    },
    '@media (max-width: 640px)': {
        icon: {
            width: 35,
            height: 35,
        },
    },
}));

const File: React.FC<FileProps> = ({
    isDirectory,
    name,
    onClick,
    path,
}) => {
    const classes = useStyles();
    const getIcon = (isDirectory, classes): React.ReactNode => {
        const Component = isDirectory ? FolderIcon : FileIcon;
        return <Component className={classes.icon} />;
    };
    return (
        <IconButton
            disabled={!isDirectory}
            onClick={(): void => {
                if (isDirectory) {
                    onClick(path);
                }
            }}
        >
            <div className={classes.root}>
                {getIcon(isDirectory, classes)}
                {name}
            </div>
        </IconButton>
    );
};

export default File;
