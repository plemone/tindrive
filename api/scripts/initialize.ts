import { ConnectionOptions, createConnection, Repository } from 'typeorm';
import { FileSystemService as FileSystem } from '../src/fs/fs.service';
import { FileEntity } from '../src/fs/file.entity';

const options: ConnectionOptions = {
    type: 'sqlite',
    database: './data/tindrive.sqlite3',
    entities: [FileEntity],
};

const populate = async (repository: Repository<FileEntity>): Promise<void> => {
    const batchSize = 140;
    const fs: FileSystem = new FileSystem();
    let files: FileEntity[] = fs.ls();
    const directoriesToVisit: FileEntity[] = files.filter(
        (file) => file.isDirectory
    );
    const fileBatches: FileEntity[][] = [];

    while (directoriesToVisit.length !== 0) {
        const file: FileEntity = directoriesToVisit.pop();
        fs.cd(file.path);
        const newFiles: FileEntity[] = fs.ls();
        for (const file of newFiles) {
            files.push(file);
            if (file.isDirectory) {
                directoriesToVisit.push(file);
            }
            if (files.length === batchSize) {
                fileBatches.push(files);
                files = [];
            }
        }
    }

    let count = 0;
    for await (const files of fileBatches) {
        await repository
            .createQueryBuilder()
            .insert()
            .into('file')
            .values(files)
            .updateEntity(false)
            .execute();
        count += files.length;
        console.log(`${count} records have been inserted so far`);
    }
};

const drop = async (repository: Repository<FileEntity>): Promise<void> => {
    const numRecords: number = await repository.count();
    repository.clear();
    console.log(`${numRecords} have been dropped`);
};

(async (): Promise<void> => {
    const connection = await createConnection(options);
    const repository: Repository<FileEntity> = connection.getRepository(
        FileEntity
    );
    await drop(repository);
    await populate(repository);
})().catch(console.error);
