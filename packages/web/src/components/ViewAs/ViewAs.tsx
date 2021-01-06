import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
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
            <div
                className={clsx(classes.root, className)}
                data-testid={dataTestid}
            >
                <Tooltip title={t('viewAs.asIcons')}>
                    <IconButton
                        data-testid='view-as-icons-button'
                        onClick={(): void => onClick(t('viewAs.optionsAsIcons'))}
                    >
                        <IconsIcon color={value === t('viewAs.optionsAsIcons') ? 'secondary' : undefined} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('viewAs.asList')}>
                    <IconButton
                        data-testid='view-as-list-button'
                        onClick={(): void => onClick(t('viewAs.optionsAsList'))}
                    >
                        <ListIcon color={value === t('viewAs.optionsAsList') ? 'secondary' : undefined} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('viewAs.asColumn')}>
                    <IconButton
                        data-testid='view-as-columns-button'
                        onClick={(): void => onClick(t('viewAs.optionsAsColumns'))}
                    >
                        <ViewColumnIcon color={value === t('viewAs.optionsAsColumns') ? 'secondary' : undefined} />
                    </IconButton>
                </Tooltip>
            </div>
        )
        : (
            <div
                className={className}
                data-testid={dataTestid}
            >
                <IconButton
                    data-testid='view-as-more-vert-button'
                    onClick={onMenuClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    data-testid='view-as-menu'
                    keepMounted
                    onClose={onMenuClose}
                    open={open}
                    PaperProps={{ className: classes.menuPaper }}
                >
                    {options.map(option => (
                        <MenuItem
                            key={option}
                            data-testid={`view-as-menu-option-${option}`}
                            onClick={(): void => onMenuSelected(option)}
                            selected={option === value}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        );
};

export default ViewAs;
