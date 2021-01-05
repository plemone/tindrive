import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip } from '@material-ui/core';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Apps as IconsIcon, List as ListIcon, ViewColumn as ViewColumnIcon } from '@material-ui/icons';
import { ViewAsProps } from './ViewAs.d';

const useStyles = makeStyles(() => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
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

    return (
        <div
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
        </div>
    );
};

export default ViewAs;
