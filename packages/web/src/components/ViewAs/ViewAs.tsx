import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
    Box,
} from '@material-ui/core';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import {
    Apps as IconsIcon,
    FormatListBulleted as ListIcon,
    ViewWeek as ViewColumnIcon,
    MoreVert as MoreVertIcon,
} from '@material-ui/icons';
import { useWindowDimensions } from '../../hooks';
import { getDeviceDimensions } from '../../utils';
import { ViewAsProps } from './ViewAs.d';

const useStyles = makeStyles(() => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
    },
    menuPaper: {
        maxHeight: 40 * 4.5,
        width: '20ch',
    },
}));

const ViewAs: React.FC<ViewAsProps> = ({
    className,
    'data-testid': dataTestid,
    value,
    onClick,
}) => {
    const classes = useStyles();
    const [t] = useTranslation('common');
    const options = [
        t('viewAs.optionsAsIcons'),
        t('viewAs.optionsAsList'),
        t('viewAs.optionsAsColumns'),
    ];
    const values = [
        'icons',
        'list',
        'columns',
    ];
    const { width } = useWindowDimensions();
    const minWidth = getDeviceDimensions().tablet.max;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const onMenuClick = (event: React.MouseEvent<HTMLElement>): void => setAnchorEl(event.currentTarget);

    const onMenuClose = (): void => setAnchorEl(null);

    const onMenuSelected = (option: string): void => {
        setAnchorEl(null);
        onClick(option);
    };

    return width >= minWidth
        ? (
            <Box
                className={clsx(classes.root, className)}
                data-testid={dataTestid}
            >
                <Tooltip title={t('viewAs.asIcons')}>
                    <IconButton onClick={(): void => onClick('icons')}>
                        <IconsIcon color={value === 'icons' ? 'secondary' : undefined} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('viewAs.asList')}>
                    <IconButton onClick={(): void => onClick('list')}>
                        <ListIcon color={value === 'list' ? 'secondary' : undefined} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('viewAs.asColumn')}>
                    <IconButton onClick={(): void => onClick('columns')}>
                        <ViewColumnIcon color={value === 'columns' ? 'secondary' : undefined} />
                    </IconButton>
                </Tooltip>
            </Box>
        )
        : (
            <Box
                className={className}
                data-testid={dataTestid}
            >
                <IconButton onClick={onMenuClick}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    onClose={onMenuClose}
                    open={open}
                    PaperProps={{ className: classes.menuPaper }}
                >
                    {options.map((option, index) => (
                        <MenuItem
                            key={option}
                            onClick={(): void => onMenuSelected(values[index])}
                            selected={values[index] === value}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        );
};

export default ViewAs;
