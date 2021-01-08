import React from 'react';
import clsx from 'clsx';
import Router from 'next/router';
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
    const customLoading = useRouterLoader(loading);
    const [t] = useTranslation('common');
    const classes = useStyles();
    const isEmpty = data?.ls?.length === 0;

    return (
        <Box
            borderRight={customLoading || hideBorder ? 0 : 1}
            className={clsx({ [classes.noContent]: customLoading || !!error || data?.ls?.length === 0 })}
            data-testid={dataTestid}
            width={400}
        >
            {!customLoading && !error && !isEmpty && (
                <List>
                    {data?.ls?.map((datum, index) => (
                        <ListItem
                            key={`file-${index}`}
                            button
                            className={datum.isDirectory ? classes.directoryRow : classes.fileRow}
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
                            <div key={index}>
                                <div className={classes.name}>
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
            {customLoading && <Spinner color='secondary' />}
        </Box>
    );
};

export default FileColumn;
