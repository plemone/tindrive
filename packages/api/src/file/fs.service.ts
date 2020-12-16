import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FileEntity } from './file.entity';

/**
 * @class Class provides abstraction for interacting with the native os file system.
 */
@Injectable()
export class FileSystemService {
    // TODO - Probably should be stored in an env variable.
    private _excluded = ['tindrive', '.DS_Store'];
    // TODO - Probably should be stored in an env variable.
    private _root = `${__dirname}/../../../../../`;
    private _pwd = this._root;

    /**
     * Given a path checks if it needs to be excluded
     * @param path The path that is checked for exlusion
     */
    private isExcluded(path: string) {
        return this._excluded.some((excludedPath) =>
            new RegExp(excludedPath).test(path)
        );
    }

    /**
     * Gets the file status
     * @param path The path to a file
     */
    private getStats(path: string): fs.Stats {
        return fs.statSync(path);
    }

    /**
     * Converts a related path to an absolute one
     * @param relativePath The relative path
     */
    private getAbsolutePath(relativePath: string) {
        return relativePath.replace(this._root, '.');
    }

    /**
     * Converts an absolute path to a relative one
     * @param absolutePath The absolute path
     */
    private getRelativePath(absolutePath: string) {
        return absolutePath.replace('.', this._root);
    }

    /**
     * Returns the current working directory the object instance is at
     */
    pwd(): string {
        return this._pwd;
    }

    /**
     * Changes the current working directory to the given path,
     * error is thrown if the path to the directory is not found
     * @param path The path to a directory
     */
    cd(path: string): void {
        if (path === '~') {
            this._pwd = this._root;
            return;
        }
        const relativePath = this.getRelativePath(path);
        if (fs.existsSync(relativePath)) {
            this._pwd = relativePath;
        } else {
            throw new Error(`Directory ${path} does not exists`);
        }
    }

    /**
     * Returns all the files and folders of current working directory.
     */
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
