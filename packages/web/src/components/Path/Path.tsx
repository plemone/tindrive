import React from 'react';
import {
    Breadcrumbs,
    Button,
} from '@material-ui/core';
import Router from 'next/router';
import { PathProps } from './Path.d';

const Path: React.FC<PathProps> = ({
    path,
    style,
    className,
}) => {
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
    const pathArr: string[] = path.split('/');
    return (
        <Breadcrumbs
            className={className}
            style={style}
        >
            {pathArr?.map((path, index) => (
                <Button
                    key={`${path}-${index}`}
                    onClick={(): void => {
                        onClick(pathArr, index);
                    }}
                >
                    {path}
                </Button>
            ))}
        </Breadcrumbs>
    );
};

export default Path;
