import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    },
    noContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 140,
    },
    name: {
        display: 'flex',
        alignItems: 'center',
        '& svg': { marginRight: 7 },
    },
    folderIcon: { fill: '#FBD405' },
    directoryRow: { cursor: 'pointer' },
}));

const FileColumns: React.FC = () => {
    const classes = useStyles();
    return (
        <div>Hello World</div>
    );
};
export default FileColumns;
