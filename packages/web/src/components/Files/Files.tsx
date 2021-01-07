import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { useRouter } from 'next/router';
import PathBreadcrumbs from '../PathBreadcrumbs';
import FileIcons from '../FileIcons';
import { FilesProps } from './Files.d';
import { ViewAs } from '../index';

export const useStyles = makeStyles(theme => ({
    pathBreadcrumbs: {
        marginTop: 20,
        marginBottom: 20,
    },
    header: { paddingLeft: theme.spacing(4), paddingRight: theme.spacing(4) },
}));

const Files: React.FC<FilesProps> = ({ 'data-testid': dataTestid }) => {
    const [viewAs, setViewAs]: ['icons' | 'list' | 'columns', Function] = React.useState('icons');
    const onViewAsClick = React.useCallback((value: string): void => setViewAs(value), []);
    const classes = useStyles();
    const router = useRouter();
    const path = router?.query?.path as string || './' as string;

    const getComponent = (viewAs: string) => {
        const componentMap = {
            'icons': FileIcons
        }
        const Component = componentMap[viewAs];
        return Component ? <Component data-testid={dataTestid}/> : null;
    }

    return (
        <>
            <Grid
                alignItems='center'
                className={classes.header}
                container
                data-testid='files-header'
                direction='row'
                justify='space-between'
                wrap='nowrap'
            >
                <PathBreadcrumbs
                    className={classes.pathBreadcrumbs}
                    data-testid='files-path-breadcrumbs'
                    path={path}
                />
                <ViewAs
                    data-testid='files-view-as'
                    onClick={onViewAsClick}
                    value={viewAs}
                />
            </Grid>
            {getComponent(viewAs)}
        </>
    );
};

export default Files;
