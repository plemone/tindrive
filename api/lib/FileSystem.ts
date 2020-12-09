import * as fs from 'fs';
import * as path from 'path';
import Node from './Node';

class FileSystem {
    private _pwd = '../../..';
    private _root = '../../..';

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
            const node: Node = new Node({
                name: file,
                path: source,
                directory: stats.isDirectory(),
                parentDir: this.pwd(),
                extension: path.extname(file) || null,
                createdDate: stats.birthtime,
                size: stats.size,
            });
            nodes.push(node);
        }
        return nodes;
    }
}

export default FileSystem;
