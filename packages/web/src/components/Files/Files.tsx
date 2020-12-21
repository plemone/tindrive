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
import { useDropzone } from 'react-dropzone';
import RootRef from '@material-ui/core/RootRef';
import { FilesProps } from './Files.d';
import { File } from '../index';

export const useStyles = makeStyles(theme => ({
    pathName: {
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
        maxHeight: '85vh',
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
        minHeight: 150,
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    loading: { width: 300 },
}));

const Files: React.FC<FilesProps> = () => {
    const onDrop = React.useCallback(acceptedFiles => {
        console.log(acceptedFiles);
    }, []);

    const classes = useStyles();
    const router = useRouter();
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    const { ref, ...rootProps } = getRootProps();
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
                className={classes.pathName}
                disabled
                value={path}
            />
            <RootRef rootRef={ref}>
                <Paper
                    {...rootProps}
                    className={clsx({
                        [classes.files]: !loading && !error && data?.ls?.length !== 0,
                        [classes.filesNoContent]: loading || !!error || data?.ls?.length === 0,
                    })}
                >
                    <input {...getInputProps()} />
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
            </RootRef>
        </>
    );
};

export default Files;
