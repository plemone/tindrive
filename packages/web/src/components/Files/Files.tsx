import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    TextField,
    CircularProgress,
} from '@material-ui/core';
import clsx from 'clsx';
import { useQuery, gql } from '@apollo/client';
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
    filesLoading: {
        maxHeight: '85vh',
        minHeight: 500,
        minWidth: 300,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading: { width: 300 },
}));

const Files: React.FC<FilesProps> = ({ path: pathProps }) => {
    const [path] = React.useState(pathProps);
    const { loading, error, data } = useQuery(gql`
        query {
            ls(path:"${path}") {
                name,
                path,
                extension,
                isDirectory,
                parentDirectory,
                createdDate,
                size,
                populatedDate
            }
        }
    `);
    const classes = useStyles();
    return (
        <>
            <TextField
                className={classes.searchBar}
                defaultValue='./'
            />
            <Paper className={clsx({
                [classes.files]: !loading,
                [classes.filesLoading]: loading,
            })}
            >
                {loading && <CircularProgress className={classes.loading} />}
                {!loading && !error && data?.ls?.map((file, index) => (
                    <File
                        key={`file-${index}`}
                        {...file}
                    />
                ))}
            </Paper>
        </>
    );
};

export default Files;
