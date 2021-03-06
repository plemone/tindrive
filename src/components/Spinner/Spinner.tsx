import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
    CircularProgress,
    Box,
} from '@material-ui/core';
import { SpinnerProps } from './Spinner.d';

// Inspired by the former Facebook spinners.
const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        marginTop: 4,
        position: 'relative',
    },
    bottom: { color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700] },
    top: {
        animationDuration: '550ms',
        position: 'absolute',
        left: 0,
    },
    circle: { strokeLinecap: 'round' },
}));

const Spinner: React.FC<SpinnerProps> = props => {
    const classes = useStyles();
    const { size, thickness, 'data-testid': dataTestid } = props;
    const customProps = { ...props };
    delete customProps['data-testid'];
    return (
        <Box
            className={classes.root}
            data-testid={dataTestid}
        >
            <CircularProgress
                className={classes.bottom}
                size={size}
                thickness={thickness}
                variant="determinate"
                {...customProps}
                value={100}
            />
            <CircularProgress
                classes={{ circle: classes.circle }}
                className={classes.top}
                disableShrink
                size={size}
                thickness={thickness}
                variant="indeterminate"
                {...customProps}
            />
        </Box>
    );
};

export default Spinner;
