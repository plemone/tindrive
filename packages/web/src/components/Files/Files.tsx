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
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        overflowY: 'auto',
        minWidth: 300,
        paddingLeft: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    filesNoContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        overflowY: 'auto',
        minWidth: 300,
        paddingLeft: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    loading: { width: 300 },
}));

const Files: React.FC<FilesProps> = ({ path: pathProps }) => {
    const [path, setPath] = React.useState(pathProps);
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
                disabled
                value={path}
            />
            <Paper className={clsx({
                [classes.files]: !loading,
                [classes.filesNoContent]: loading,
                [classes.filesNoContent]: data?.ls?.length === 0,
                [classes.filesNoContent]: error,
            })}
            >
                {loading && <CircularProgress className={classes.loading} />}
                {!loading && !error && data?.ls?.length === 0 && 'Folder is empty'}
                {!loading && !error && data?.ls?.map((file, index) => (
                    <File
                        key={`file-${index}`}
                        {...file}
                        onClick={(path: string): void => setPath(path)}
                    />
                ))}
                {!loading && error && 'An error has occured'}
            </Paper>
        </>
    );
};

export default Files;
