import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    TextField,
} from '@material-ui/core';
import { FilesProps } from './Files.d';
import { File } from '../index';

export const useStyles = makeStyles(theme => ({
    searchBar: {
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
    },
    files: {
        overflowY: 'auto',
        flexWrap: 'wrap',
        maxHeight: '85vh',
        minHeight: 500,
        minWidth: 300,
        paddingLeft: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}));

const Files: React.FC<FilesProps> = () => {
    const classes = useStyles();
    const files = [];
    for (let i = 0; i < 5; ++i) {
        const file = {
            name: 'foo.txt',
            path: './foo.txt',
            extension: '.txt',
            isDirectory: i % 2 === 0,
            parentDirectory: '.',
            createdDate: new Date(),
            size: 200003,
            populatedDate: new Date(),
        };
        files.push(<File
            key={i}
            {...file}
        />);
    }
    return (
        <>
            <TextField
                className={classes.searchBar}
                defaultValue='./'
            />
            <Paper className={classes.files}>{files}</Paper>
        </>
    );
};

export default Files;
