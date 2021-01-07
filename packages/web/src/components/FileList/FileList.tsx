import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@material-ui/core';
import { useQuery } from '@apollo/client';
import Router, { useRouter } from 'next/router';
import {
    InsertDriveFile as FileIcon,
    Folder as FolderIcon,
} from '@material-ui/icons';
import Spinner from '../Spinner';
import { FileListProps } from './FileList.d';
import { getDeviceDimensions } from '../../utils';
import { useRouterLoader } from '../../hooks';
import { ls } from '../../queries';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    },
    name: {
        display: 'flex',
        alignItems: 'center',
        '& svg': { marginRight: 7 },
    },
    table: { minWidth: getDeviceDimensions().mobile.min },
    noContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 300,
    },
    folderIcon: { fill: '#FBD405' },
    directoryRow: { cursor: 'pointer' },
}));

const FileList: React.FC<FileListProps> = ({ 'data-testid': dataTestid }) => {
    const classes = useStyles();
    const router = useRouter();
    const path = router?.query?.path as string || './' as string;
    const { error, loading = true, data } = useQuery(ls, { variables: { path } });
    const customLoading = useRouterLoader(loading);

    return (
        <div
            className={classes.root}
            data-testid={dataTestid}
        >
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align='right'>Kind</TableCell>
                        <TableCell align='right'>Created Date</TableCell>
                        <TableCell align='right'>Size</TableCell>
                    </TableRow>
                </TableHead>
                {!customLoading && !error && (
                    <TableBody>
                        {data?.ls?.map(datum => (
                            <TableRow
                                key={datum.name}
                                className={clsx({ [classes.directoryRow]: datum.isDirectory })}
                                hover
                                onClick={
                                    datum.isDirectory
                                        ? (): void => {
                                        // Calling Router with these options should invoke the file called ../../../pages/[path].tsx
                                            Router.push({
                                                pathname: '/',
                                                query: { path: datum.path },
                                            });
                                        } : undefined
                                }
                            >
                                <TableCell
                                    component='th'
                                    scope='row'
                                >
                                    <div className={classes.name}>
                                        {datum.isDirectory ? <FolderIcon className={classes.folderIcon} /> : <FileIcon />}
                                        {datum.name}
                                    </div>
                                </TableCell>
                                <TableCell align='right'>{datum.extension || 'folder'}</TableCell>
                                <TableCell align='right'>{datum.createdDate}</TableCell>
                                <TableCell align='right'>
                                    {`${Math.round((datum.size / 1024) * 10) / 10} KB`}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
                {customLoading && <div className={classes.noContent}><Spinner color='secondary' /></div>}
            </Table>
        </div>
    );
};

export default FileList;
