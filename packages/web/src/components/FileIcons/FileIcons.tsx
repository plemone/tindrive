import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useQuery } from '@apollo/client';
import Router, { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { ls } from '../../queries';
import { FileIconsProps } from './FileIcons.d';
import { File, Spinner } from '../index';
import { useRouterLoader } from '../../hooks';

export const useStyles = makeStyles(theme => ({
    files: {
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
    filesNoContent: {
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

    return (
        <div
            className={clsx({
                [classes.files]: !customLoading && !error && data?.ls?.length !== 0,
                [classes.filesNoContent]: customLoading || !!error || data?.ls?.length === 0,
            })}
            data-testid={dataTestid || 'files'}
        >
            {customLoading && (
                <Spinner
                    color='secondary'
                    data-testid='files-spinner'
                    size={30}
                />
            )}
            {!customLoading && !error && data?.ls?.length === 0 && t('files.folderIsEmpty')}
            {!customLoading && !error && data?.ls?.map((file, index) => (
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
            {!customLoading && error && 'An error has occured'}
        </div>
    );
};

export default FileIcons;
