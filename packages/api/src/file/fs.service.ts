import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FileEntity } from './file.entity';

@Injectable()
export class FileSystemService {
    private _excluded = ['tindrive', '.DS_Store'];
    private _root = `${__dirname}/../../../../../`;
    private _pwd = this._root;

    private isExcluded(path: string) {
        return this._excluded.some((excludedPath) =>
            new RegExp(excludedPath).test(path)
        );
    }

    private getStats(file: string): fs.Stats {
        return fs.statSync(file);
    }

    private getAbsolutePath(relativePath) {
        return relativePath.replace(this._root, '.');
    }

    private getRelativePath(absolutePath) {
        return absolutePath.replace('.', this._root);
    }

    pwd(): string {
        return this._pwd;
    }

    cd(directory: string): void {
        directory = this.getRelativePath(directory);
        if (directory === '~') {
            this._pwd = this._root;
            return;
        }
        if (fs.existsSync(directory)) {
            this._pwd = directory;
        } else {
            throw new Error(`Diretory ${directory} does not exists`);
        }
    }

    ls(): FileEntity[] {
        const fileStrings: string[] = fs.readdirSync(this.pwd());
        const files: FileEntity[] = [];
        for (const file of fileStrings) {
            const absolutePath = `${this.pwd()}/${file}`;
            const relativePath = this.getAbsolutePath(absolutePath);
            if (this.isExcluded(relativePath)) continue;
            const stats: fs.Stats = this.getStats(absolutePath);
            const fileEntity = new FileEntity();
            fileEntity.name = file;
            fileEntity.path = relativePath;
            fileEntity.isDirectory = stats.isDirectory();
            fileEntity.parentDirectory = this.getAbsolutePath(this.pwd());
            fileEntity.extension = path.extname(file) || null;
            fileEntity.createdDate = stats.birthtime;
            fileEntity.size = stats.size;
            files.push(fileEntity);
        }
        return files;
    }
}
