import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';

/**
 * Class provides abstraction for the communication with the file database repository
 */
@Injectable()
export class FileService {
    /**
     * Instantiates the class and performs the necessary dependency injections
     * @param fileRepository Instance of file repository available via dependency injection
     */
    constructor(@InjectRepository(FileEntity) private fileRepository) {}

    /**
     * Returns all the file entities for a given parent directory
     * @param parentDirectory The path of the parent directory
     */
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
