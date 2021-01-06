import { StandardProps } from '../../index.d';

export interface ViewAsProps extends StandardProps {
    onClick: function;
    value: 'As icons' | 'As list' | 'As columns';
}
