import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useQuery } from '@apollo/client';
import Router, { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { ls } from '../../queries';
import { FileIconsProps } from './FileIcons.d';
import { FileIcon, Spinner } from '../index';
import { useRouterLoader } from '../../hooks';

export const useStyles = makeStyles(theme => ({
    content: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        overflowY: 'auto',
        height: '100%',
        width: '100%',
        outlineStyle: 'none',
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    noContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        overflowY: 'auto',
        height: '100%',
        width: '100%',
        minHeight: 140,
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}));

const FileIcons: React.FC<FileIconsProps> = ({ 'data-testid': dataTestid }) => {
    const classes = useStyles();
    const router = useRouter();
    const [t] = useTranslation('common');
    const path = router?.query?.path as string || './' as string;
    const { error, loading = true, data } = useQuery(ls, { variables: { path } });
    const customLoading = useRouterLoader(loading);
    const isEmpty = data?.ls?.length === 0;

    return (
        <Box
            className={clsx({
                [classes.content]: !customLoading && !error && data?.ls?.length !== 0,
                [classes.noContent]: customLoading || !!error || data?.ls?.length === 0,
            })}
            data-testid={dataTestid}
        >
            {customLoading && (
                <Spinner
                    color="secondary"
                    data-testid="file-icons-spinner"
                    size={30}
                />
            )}
            {!customLoading && !error && !isEmpty && data?.ls?.map((file: {
                name: string;
                path: string;
                extension: string;
                isDirectory: boolean;
                parentDirectory: string;
                createdDate: Date;
                size: number;
                populatedDate: Date;
                onClick: (path: string) => void;
            }) => (
                <FileIcon
                    key={`file-icon-${file.path}`}
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
            {!customLoading && !error && isEmpty && t('files.folderIsEmpty')}
            {!customLoading && error && t('error.unknown')}
        </Box>
    );
};

export default FileIcons;
