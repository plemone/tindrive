import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';

@Injectable()
export class FileService {
    constructor(@InjectRepository(FileEntity) private fileRepository) {}

    async findByParentDirectory(
        parentDirectory: string
    ): Promise<FileEntity[]> {
        if (parentDirectory[parentDirectory.length - 1] === '/') {
            parentDirectory = parentDirectory.substring(
                0,
                parentDirectory.length - 1
            );
        }
        return this.fileRepository.find({
            where: { parentDirectory },
        });
    }
}
