import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { FilesProps } from './Files.d';

export const useStyles = makeStyles(theme => ({
    root: {
        width: '95%',
        height: '95vh',
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        minHeight: 400,
    },
}));

const Files: React.FC<FilesProps> = () => {
    const classes = useStyles();
    return (
        <Paper className={classes.root}><></></Paper>
    );
};

export default Files;
