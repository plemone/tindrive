import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FileEntity } from './file.entity';

@Injectable()
export class FileSystemService {
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

    ls(): FileEntity[] {
        const fileStrings: string[] = fs.readdirSync(this.pwd());
        const files: FileEntity[] = [];
        for (const file of fileStrings) {
            const source = `${this.pwd()}/${file}`;
            const stats: fs.Stats = this.stats(source);
            const fileEntity = new FileEntity();
            fileEntity.name = file;
            fileEntity.path = source;
            fileEntity.isDirectory = stats.isDirectory();
            fileEntity.parentDirectory = this.pwd();
            fileEntity.extension = path.extname(file) || null;
            fileEntity.createdDate = stats.birthtime;
            fileEntity.size = stats.size;
            files.push(fileEntity);
        }
        return files;
    }
}
