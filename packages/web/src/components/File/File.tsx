import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    IconButton,
    Typography,
} from '@material-ui/core';
import {
    InsertDriveFile as FileIcon,
    Folder as FolderIcon,
} from '@material-ui/icons';
import { FileProps } from './File.d';

export const useStyles = makeStyles(theme => ({
    root: {
        width: 55,
        height: 50,
    },
    '@media (max-width: 640px)': {
        root: {
            width: 40,
            height: 40,
        },
    },
}));

const File: React.FC<FileProps> = ({
    isDirectory,
    name,
}) => {
    const classes = useStyles();
    const getIcon = (isDirectory, classes): React.ReactNode => {
        const Component = isDirectory ? FolderIcon : FileIcon;
        return <Component className={classes.root} />;
    };
    return (
        <IconButton>
            <Container>
                {getIcon(isDirectory, classes)}
                <Typography>{name}</Typography>
            </Container>
        </IconButton>
    );
};

export default File;
