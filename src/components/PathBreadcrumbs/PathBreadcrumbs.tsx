import React from 'react';
import {
    Breadcrumbs,
    Button,
    Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Router from 'next/router';
import { PathBreadcrumbsProps } from './PathBreadcrumbs.d';
import { useWindowDimensions } from '../../hooks';
import { getDeviceDimensions } from '../../utils';

export const useStyles = makeStyles(() => ({ button: { textTransform: 'none' } }));

const PathBreadcrumbs: React.FC<PathBreadcrumbsProps> = ({
    path,
    style,
    className,
    'data-testid': dataTestid,
}) => {
    const separator = '›';
    const maxItem = 6;
    const { width } = useWindowDimensions();
    const minWidth = getDeviceDimensions().tablet.max;
    const onClick = (pathArr: string[], index: number): void => {
        let path = '';
        for (let i = 0; i < index + 1; ++i) {
            path += `${pathArr[i]}/`;
        }
        // Calling Router with these options should invoke the file called ../../../pages/[path].tsx
        Router.push({
            pathname: '/',
            query: { path },
        });
    };
    const classes = useStyles();
    const pathArr: string[] = path.split('/').filter(path => !!path);

    return (
        <Breadcrumbs
            className={className}
            data-testid={dataTestid}
            maxItems={maxItem}
            separator={separator}
            style={style}
        >
            {width <= minWidth
                ? (
                    <Tooltip title={path?.replace('.', 'root')?.replaceAll('/', ` ${separator} `) || ''}>
                        <Button className={classes.button}>
                            {pathArr[pathArr.length - 1] === '.' ? 'root' : pathArr[pathArr.length - 1]}
                        </Button>
                    </Tooltip>
                )
                : pathArr?.reduce((acc, path, index) => {
                    if (path) {
                        acc.push(
                            <Button
                                key={`path-breadcrumb-${path}`}
                                className={classes.button}
                                onClick={(): void => {
                                    onClick(pathArr, index);
                                }}
                            >
                                {path === '.' ? 'root' : path}
                            </Button>,
                        );
                    }
                    return acc;
                }, [])}
        </Breadcrumbs>
    );
};

export default PathBreadcrumbs;
