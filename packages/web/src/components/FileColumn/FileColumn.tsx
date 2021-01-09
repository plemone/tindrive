import React from 'react';
import clsx from 'clsx';
import Router, { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import {
    InsertDriveFile as FileIcon,
    Folder as FolderIcon,
} from '@material-ui/icons';
import {
    List,
    ListItem,
    Box,
} from '@material-ui/core';
import { FileColumnProps } from './FileColumn.d';
import { useRouterLoader } from '../../hooks';
import { ls } from '../../queries';
import { Spinner } from '../index';

const useStyles = makeStyles(() => ({
    noContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 140,
    },
    name: {
        display: 'flex',
        alignItems: 'center',
        '& svg': { marginRight: 7 },
    },
    folderIcon: { fill: '#FBD405' },
    directoryRow: { cursor: 'pointer' },
    fileRow: { cursor: 'default' },
}));

const FileColumn: React.FC<FileColumnProps> = ({
    path,
    hideBorder = false,
    'data-testid': dataTestid,
}) => {
    const { error, loading = true, data } = useQuery(ls, { variables: { path } });
    const router = useRouter();
    const routerPath = router?.query?.path as string || './' as string;
    const customLoading = useRouterLoader(loading);
    const [t] = useTranslation('common');
    const classes = useStyles();
    const isEmpty = data?.ls?.length === 0;
    const segmentedPath = routerPath.split('/').filter(path => !!path);

    return (
        <Box
            borderRight={customLoading || hideBorder ? 0 : 1}
            className={clsx({ [classes.noContent]: customLoading || !!error || data?.ls?.length === 0 })}
            data-testid={dataTestid || 'file-column'}
            width={400}
        >
            {!customLoading && !error && !isEmpty && (
                <List data-testid='file-column-list'>
                    {data?.ls?.map((datum, index) => (
                        <ListItem
                            key={`file-${index}`}
                            button
                            className={datum.isDirectory ? classes.directoryRow : classes.fileRow}
                            data-testid={`file-column-list-item-${index}`}
                            onClick={
                                datum.isDirectory
                                    ? (): void => {
                                        if (routerPath === datum.path) {
                                            router.push({
                                                pathname: '/',
                                                query: { path: datum.parentDirectory },
                                            });
                                            return;
                                        }
                                        // Calling Router with these options should invoke the file called ../../../pages/[path].tsx
                                        Router.push({
                                            pathname: '/',
                                            query: { path: datum.path },
                                        });
                                    } : undefined
                            }
                            selected={segmentedPath.includes(datum.name)}
                        >
                            <div
                                key={index}
                                data-testid={`file-column-list-item-content-${index}`}
                            >
                                <div
                                    className={classes.name}
                                    data-testid={`file-column-list-item-content-name-${index}`}
                                >
                                    {datum.isDirectory ? <FolderIcon className={classes.folderIcon} /> : <FileIcon />}
                                    {datum.name}
                                </div>
                            </div>
                        </ListItem>

                    ))}
                </List>
            )}
            {!customLoading && !error && isEmpty && t('files.folderIsEmpty')}
            {!customLoading && error && t('error.unknown')}
            {customLoading && (
                <Spinner
                    color='secondary'
                    data-testid='file-column-spinner'
                />
            )}
        </Box>
    );
};

export default FileColumn;
