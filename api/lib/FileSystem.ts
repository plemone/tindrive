import * as fs from 'fs';
import * as path from 'path';

export interface Node {
    readonly name: string;
    readonly path: string;
    readonly extension: string | null;
    readonly directory: boolean;
    readonly parentDir: string;
    readonly createdDate: Date;
    readonly size: number;
}

class FileSystem {
    private _pwd = '.';
    private _root = '.';

    private stats(file: string): fs.Stats {
        return fs.statSync(file);
    }

    pwd(): string {
        return this._pwd;
    }

    cd(folder: string): void {
        if (folder === '~') {
            this._pwd = this._root;
            return;
        }
        if (fs.existsSync(folder)) {
            this._pwd = folder;
        }
    }

    ls(): Node[] {
        const files: string[] = fs.readdirSync(this.pwd());
        const nodes: Node[] = [];
        for (const file of files) {
            const source = `${this.pwd()}/${file}`;
            const stats: fs.Stats = this.stats(source);
            nodes.push({
                name: file,
                path: source,
                directory: stats.isDirectory(),
                parentDir: this.pwd(),
                extension: path.extname(file) || null,
                createdDate: stats.birthtime,
                size: stats.size,
            } as Node);
        }
        return nodes;
    }
}

export default FileSystem;
