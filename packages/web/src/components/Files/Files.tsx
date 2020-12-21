import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    TextField,
    CircularProgress,
} from '@material-ui/core';
import clsx from 'clsx';
import { useQuery, gql } from '@apollo/client';
import Router, { useRouter } from 'next/router';
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
        paddingLeft: theme.spacing(2),
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
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    loading: { width: 300 },
}));

const Files: React.FC<FilesProps> = () => {
    const classes = useStyles();
    const router = useRouter();
    const path = router.query?.path || './';
    const { error, loading, data } = useQuery(gql`
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

    return (
        <>
            <TextField
                className={classes.searchBar}
                disabled
                value={path}
            />
            <Paper className={clsx({
                [classes.files]: !loading && !error && data?.ls?.length !== 0,
                [classes.filesNoContent]: loading || !!error || data?.ls?.length === 0,
            })}
            >
                {loading && <CircularProgress className={classes.loading} />}
                {!loading && !error && data?.ls?.length === 0 && 'Folder is empty'}
                {!loading && !error && data?.ls?.map((file, index) => (
                    <File
                        key={`file-${index}`}
                        {...file}
                        onClick={(path: string): void => {
                            // Calling Router with these options should invoke the file called ../../../pages/[path].tsx
                            Router.push({
                                pathname: '/',
                                query: { path },
                            });
                        }}
                    />
                ))}
                {!loading && error && 'An error has occured'}
            </Paper>
        </>
    );
};

export default Files;
