import { StandardProps } from '../../index.d';

export interface ViewAsProps extends StandardProps {
    onClick: function;
    value: 'icons' | 'list' | 'columns';
}
