import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { useRouter } from 'next/router';
import PathBreadcrumbs from '../PathBreadcrumbs';
import {
    FileIcons,
    FileList,
    FileColumns,
    ViewAs,
} from '../..';
import { FilesProps } from './Files.d';

import { useCookie } from '../../hooks';

export const useStyles = makeStyles(theme => ({
    pathBreadcrumbs: {
        marginTop: 20,
        marginBottom: 20,
    },
    header: { paddingLeft: theme.spacing(4), paddingRight: theme.spacing(4) },
}));

const Files: React.FC<FilesProps> = ({
    'data-testid': dataTestid,
    viewAs: initialViewAsValue,
}) => {
    const [viewAs, setViewAs] = React.useState(initialViewAsValue || 'icons');
    useCookie('viewAs', viewAs);
    const onViewAsClick = React.useCallback((value: string): void => setViewAs(value), []);
    const classes = useStyles();
    const router = useRouter();
    const path = router?.query?.path as string || './' as string;

    const getComponent = (viewAs: string): JSX.Element | void => {
        const componentMap = {
            icons: FileIcons,
            list: FileList,
            columns: FileColumns,
        };
        const Component = componentMap[viewAs];
        return Component ? <Component data-testid={dataTestid} /> : null;
    };

    return (
        <>
            <Grid
                alignItems="center"
                className={classes.header}
                container
                direction="row"
                justify="space-between"
                wrap="nowrap"
            >
                <PathBreadcrumbs
                    className={classes.pathBreadcrumbs}
                    path={path}
                />
                <ViewAs
                    onClick={onViewAsClick}
                    value={viewAs as 'icons' | 'list' | 'columns'}
                />
            </Grid>
            {getComponent(viewAs)}
        </>
    );
};

export default Files;
