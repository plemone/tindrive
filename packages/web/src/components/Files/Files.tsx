import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import clsx from 'clsx';
import { useQuery } from '@apollo/client';
import Router, { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { ls } from '../../queries';
import PathBreadcrumbs from '../PathBreadcrumbs';
import { FilesProps } from './Files.d';
import { File, Spinner } from '../index';
import { getDimensionCutoff } from '../../utils';

export const useStyles = makeStyles(theme => ({
    path: {
        marginTop: 20,
        marginBottom: 20,
        flex: 2,
    },
    files: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        overflowY: 'auto',
        minWidth: getDimensionCutoff().mobile.min,
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
        minWidth: getDimensionCutoff().mobile.min,
        minHeight: 140,
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    dragging: { backgroundColor: theme.palette.success.main },
    header: { paddingLeft: theme.spacing(4), paddingRight: theme.spacing(4) },
}));

const Files: React.FC<FilesProps> = ({ 'data-testid': dataTestid }) => {
    const [dragging, setDragging] = React.useState(false);

    const onDrop = React.useCallback(() => {
        setDragging(false);
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
    const path = router?.query?.path as string || './' as string;
    const { error, loading = true, data } = useQuery(ls, { variables: { path } });

    return (
        <>

            <Grid
                alignItems='center'
                className={classes.header}
                container
                data-testid='files-header'
                direction='row'
            >
                <PathBreadcrumbs
                    className={classes.path}
                    data-testid='files-path-breadcrumbs'
                    path={path}
                />
            </Grid>
            <div
                data-testid={dataTestid || 'files'}
                {...getRootProps}
                className={clsx({
                    [classes.files]: !loading && !error && data?.ls?.length !== 0,
                    [classes.filesNoContent]: loading || !!error || data?.ls?.length === 0,
                    [classes.dragging]: dragging,
                })}
            >
                <input {...getInputProps()} />
                {loading && (
                    <Spinner
                        color='secondary'
                        data-testid='files-spinner'
                        size={30}
                    />
                )}
                {!loading && !error && data?.ls?.length === 0 && 'Folder is empty'}
                {!loading && !error && data?.ls?.map((file, index) => (
                    <File
                        key={`file-${index}`}
                        data-testid={`files-file-${index}`}
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
            </div>
        </>
    );
};

export default Files;
