import React from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { FileColumnsProps } from './FileColumns.d';
import { FileColumn } from '../index';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        overflowX: 'auto',
        display: 'flex',
        flexDirection: 'row',
    },
}));

const FileColumns: React.FC<FileColumnsProps> = ({ 'data-testid': dataTestid }) => {
    const router = useRouter();
    const classes = useStyles();
    const path = router?.query?.path as string || './' as string;
    const segmentedPath = path.split('/').filter(directory => !!directory);
    const columnPaths = segmentedPath.reduce((acc: string[], _path: string, index: number): string[] => {
        acc.push(segmentedPath.slice(0, index + 1).join('/'));
        return acc;
    }, []);

    return (
        <Box
            className={classes.root}
            data-testid={dataTestid}
        >
            {
                columnPaths.map((path: string, index: number): JSX.Element => (
                    <FileColumn
                        key={`file-column-${index}`}
                        data-testid={`file-column-${index}`}
                        hideBorder={index === columnPaths.length - 1}
                        index={index + 1}
                        path={path}
                    />
                ))
            }
        </Box>
    );
};

export default FileColumns;
