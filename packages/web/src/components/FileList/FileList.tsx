import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
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
import { useTranslation } from 'react-i18next';
import Spinner from '../Spinner';
import { FileListProps } from './FileList.d';
import { useRouterLoader } from '../../hooks';
import { ls } from '../../queries';
import { getExtensionDescriptions } from '../../utils';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    },
    noContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 140,
    },
    name: {
        display: 'flex',
        alignItems: 'center',
        '& svg': { marginRight: 7 },
    },
    folderIcon: { fill: '#FBD405' },
    directoryRow: { cursor: 'pointer' },
}));

const FileList: React.FC<FileListProps> = ({ 'data-testid': dataTestid }) => {
    const classes = useStyles();
    const router = useRouter();
    const [t] = useTranslation('common');
    const path = router?.query?.path as string || './' as string;
    const { error, loading = true, data } = useQuery(ls, { variables: { path } });
    const customLoading = useRouterLoader(loading);
    const isEmpty = data?.ls?.length === 0;

    return (
        <Box
            className={clsx(classes.root, { [classes.noContent]: customLoading || !!error || isEmpty })}
            data-testid={dataTestid || 'file-list'}
        >
            {!customLoading && !error && !isEmpty && (
                <Table data-testid="file-list-table">
                    <TableHead data-testid="file-list-table-header">
                        <TableRow>
                            <TableCell data-testid="file-list-table-header-name">Name</TableCell>
                            <TableCell
                                align="right"
                                data-testid="file-list-table-header-kind"
                            >
                                Kind
                            </TableCell>
                            <TableCell
                                align="right"
                                data-testid="file-list-table-header-created-date"
                            >
                                Created Date
                            </TableCell>
                            <TableCell
                                align="right"
                                data-testid="file-list-table-header-size"
                            >
                                Size
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody data-testid="file-list-table-content">
                        {data?.ls?.map((datum, index) => (
                            <TableRow
                                key={`file-row-${datum.path}`}
                                className={clsx({ [classes.directoryRow]: datum.isDirectory })}
                                data-testid={`file-list-table-row-${index}`}
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
                                    component="th"
                                    data-testid={`file-list-table-row-${index}-name`}
                                    scope="row"
                                >
                                    <Box className={classes.name}>
                                        {datum.isDirectory ? (
                                            <FolderIcon
                                                className={classes.folderIcon}
                                                data-testid={`file-list-table-item-folder-${index}`}
                                            />
                                        ) : (
                                            <FileIcon
                                                data-testid={`file-list-table-item-file-${index}`}
                                            />
                                        )}
                                        {datum.name}
                                    </Box>
                                </TableCell>
                                <TableCell
                                    align="right"
                                    data-testid={`file-list-table-row-${index}-extension`}
                                >
                                    {
                                        datum.extension
                                            ? getExtensionDescriptions(datum.extension)[0] || 'Unknown'
                                            : (datum.isDirectory ? 'Folder' : 'File')
                                    }
                                </TableCell>
                                <TableCell
                                    align="right"
                                    data-testid={`file-list-table-row-${index}-created-date`}
                                >
                                    {moment(datum.createdDate).format('LLLL')}

                                </TableCell>
                                <TableCell
                                    align="right"
                                    data-testid={`file-list-table-row-${index}-size`}
                                >
                                    {`${Math.round((datum.size / 1024) * 10) / 10} KB`}

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {isEmpty && t('files.folderIsEmpty')}
            {customLoading && (
                <Spinner
                    color="secondary"
                    data-testid="file-list-spinner"
                />
            )}
            {error && t('error.unknown')}
        </Box>
    );
};

export default FileList;
