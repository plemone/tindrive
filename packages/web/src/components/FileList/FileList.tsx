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
    content: { minWidth: getDeviceDimensions().mobile.min },
    noContent: { minWidth: getDeviceDimensions().mobile.min },
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
            <Table className={clsx({
                [classes.content]: !customLoading && !error && data?.ls?.length !== 0,
                [classes.noContent]: customLoading || !!error || data?.ls?.length === 0,
            })}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align='right'>Kind</TableCell>
                        <TableCell align='right'>Created Date</TableCell>
                        <TableCell align='right'>Size</TableCell>
                    </TableRow>
                </TableHead>
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
            </Table>
        </div>
    );
};

export default FileList;
