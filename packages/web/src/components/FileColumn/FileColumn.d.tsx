import { StandardProps } from '../../index.d';

export interface FileColumnProps extends StandardProps {
    path: string;
    index: number;
    hideBorder?: boolean;
}
