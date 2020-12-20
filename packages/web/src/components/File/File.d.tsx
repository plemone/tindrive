import { StandardProps } from '../../index.d';

export interface FileProps extends StandardProps {
    name: string;
    path: string;
    extension: string;
    isDirectory: boolean;
    parentDirectory: string;
    createdDate: Date;
    size: number;
    populatedDate: Date;
}
