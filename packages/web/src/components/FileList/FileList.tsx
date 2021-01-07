import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { FileListProps } from './FileList.d';
import { getDeviceDimensions } from '../../utils';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    },
    table: { minWidth: getDeviceDimensions().mobile.min },
}));

const FileList: React.FC<FileListProps> = () => {
    const classes = useStyles();
    const data = [];
    return (
        <div className={classes.root}>
            <TableContainer component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align='right'>Path</TableCell>
                            <TableCell align='right'>Extension</TableCell>
                            <TableCell align='right'>Created Date</TableCell>
                            <TableCell align='right'>Size</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(row => (
                            <TableRow key={row.name}>
                                <TableCell
                                    component='th'
                                    scope='row'
                                >
                                    {row.name}
                                </TableCell>
                                <TableCell align='right'>{row.path}</TableCell>
                                <TableCell align='right'>{row.extension}</TableCell>
                                <TableCell align='right'>{row.createdDate}</TableCell>
                                <TableCell align='right'>{row.size}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default FileList;
