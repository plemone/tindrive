import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    CircularProgress,
} from '@material-ui/core';
import clsx from 'clsx';
import { useQuery, gql } from '@apollo/client';
import Router, { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import PathBreadcrumbs from '../PathBreadcrumbs';
import { FilesProps } from './Files.d';
import { File } from '../index';

export const useStyles = makeStyles(theme => ({
    path: {
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
        outlineStyle: 'none',
    },
    filesNoContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        overflowY: 'auto',
        minWidth: 300,
        minHeight: 140,
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    dragging: { backgroundColor: theme.palette.success.main },
    loading: { width: 300 },
}));

const Files: React.FC<FilesProps> = () => {
    const [dragging, setDragging] = React.useState(false);

    const onDrop = React.useCallback(acceptedFiles => {
        setDragging(false);
        console.log(acceptedFiles);
    }, []);

    const onDragEnter = React.useCallback(() => {
        setDragging(true);
    }, []);

    const onDragLeave = React.useCallback(() => {
        setDragging(false);
    }, []);

    const classes = useStyles();
    const router = useRouter();
    const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true, onDragEnter, onDragLeave });
    const path = router.query?.path as string || './' as string;
    const { error, loading = true, data } = useQuery(gql`
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
            <PathBreadcrumbs
                className={classes.path}
                path={path}
            />
            <Paper
                {...getRootProps}
                className={clsx({
                    [classes.files]: !loading && !error && data?.ls?.length !== 0,
                    [classes.filesNoContent]: loading || !!error || data?.ls?.length === 0,
                    [classes.dragging]: dragging,
                })}
            >
                <input {...getInputProps()} />
                {loading && (
                    <CircularProgress
                        className={classes.loading}
                        color='secondary'
                        size={30}
                    />
                )}
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
