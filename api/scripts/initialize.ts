import { ConnectionOptions, createConnection, Repository } from 'typeorm';
import { FileSystemService } from '../src/fs/fs.service';
import { FileEntity } from '../src/fs/file.entity';

const options: ConnectionOptions = {
    type: 'sqlite',
    database: './data/tindrive.sqlite3',
    entities: [FileEntity],
};
const batchSize = 140;
const batchProcessSize = 200;

const insert = async (
    repository: Repository<FileEntity>,
    fileBatches: FileEntity[][],
    insertionCount: number
): Promise<number> => {
    const promises = [];
    for (const files of fileBatches) {
        promises.push(
            new Promise((resolve, reject) => {
                repository
                    .createQueryBuilder()
                    .insert()
                    .into('file')
                    .values(files)
                    .updateEntity(false)
                    .execute()
                    .then(() => {
                        insertionCount += files.length;
                        console.log(
                            `Number of records inserted: ${insertionCount}`
                        );
                        resolve(undefined);
                    })
                    .catch(reject);
            })
        );
    }
    await Promise.all(promises);
    return insertionCount;
};

function* createBatchIterator() {
    const fs: FileSystemService = new FileSystemService();
    let files: FileEntity[] = fs.ls();
    const dfsStack: FileEntity[] = files.filter((file) => file.isDirectory);
    let fileBatches: FileEntity[][] = [];

    while (dfsStack.length !== 0) {
        const file: FileEntity = dfsStack.pop();
        fs.cd(file.path);
        const newFiles: FileEntity[] = fs.ls();
        for (const file of newFiles) {
            files.push(file);
            if (file.isDirectory) {
                dfsStack.push(file);
            }
            if (files.length === batchSize) {
                fileBatches.push(files);
                files = [];
                if (fileBatches.length === batchProcessSize) {
                    yield fileBatches;
                    fileBatches = [];
                }
            }
        }
    }

    if (files.length > 0) {
        fileBatches.push(files);
    }
    if (fileBatches.length > 0) {
        yield fileBatches;
    }
}

const drop = async (repository: Repository<FileEntity>): Promise<void> => {
    const numRecords: number = await repository.count();
    repository.clear();
    console.log(`${numRecords} have been dropped`);
};

const main = async (): Promise<void> => {
    console.time('Script execution time');
    const connection = await createConnection(options);
    await connection.synchronize();
    const repository: Repository<FileEntity> = connection.getRepository(
        FileEntity
    );
    const batchIterator = createBatchIterator();
    let insertionCount = 0;
    await drop(repository);
    for await (const batch of batchIterator) {
        insertionCount = await insert(repository, batch, insertionCount);
    }
    console.timeEnd('Script execution time');
};

(async (): Promise<void> => main())().catch(console.error);
