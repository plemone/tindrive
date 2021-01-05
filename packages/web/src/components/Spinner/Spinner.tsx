import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
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
        <div
            className={classes.root}
            data-testid={dataTestid}
        >
            <CircularProgress
                className={classes.bottom}
                data-testid='spinner-determinate'
                size={size}
                thickness={thickness}
                variant='determinate'
                {...customProps}
                value={100}
            />
            <CircularProgress
                classes={{ circle: classes.circle }}
                className={classes.top}
                data-testid='spinner-indeterminate'
                disableShrink
                size={size}
                thickness={thickness}
                variant='indeterminate'
                {...customProps}
            />
        </div>
    );
};

export default Spinner;
