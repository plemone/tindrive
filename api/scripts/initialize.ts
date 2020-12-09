import { ConnectionOptions, createConnection, Repository } from 'typeorm';
import { FileSystem, Node } from '../lib';
import { NodeEntity } from '../src/fs/node.entity';

const options: ConnectionOptions = {
    type: 'sqlite',
    database: './data/tindrive.sqlite3',
    entities: [NodeEntity],
};

const populate = async (repository: Repository<NodeEntity>): Promise<void> => {
    const batchSize = 140;
    const fs: FileSystem = new FileSystem();
    let nodes: Node[] = fs.ls();
    const directoriesToVisit: Node[] = nodes.filter((node) => node.directory);
    const nodeBatches: Node[][] = [];

    while (directoriesToVisit.length !== 0) {
        const node: Node = directoriesToVisit.pop();
        fs.cd(node.path);
        const newNodes: Node[] = fs.ls();
        for (const node of newNodes) {
            nodes.push(node);
            if (node.directory) {
                directoriesToVisit.push(node);
            }
            if (nodes.length === batchSize) {
                nodeBatches.push(nodes);
                nodes = [];
            }
        }
    }

    let count = 0;
    for await (const nodes of nodeBatches) {
        await repository
            .createQueryBuilder()
            .insert()
            .into('node')
            .values(nodes)
            .updateEntity(false)
            .execute();
        count += nodes.length;
        console.log(`${count} records have been inserted so far`);
    }
};

const drop = async (repository: Repository<NodeEntity>): Promise<void> => {
    const numRecords: number = await repository.count();
    repository.clear();
    console.log(`${numRecords} have been dropped`);
};

(async (): Promise<void> => {
    const connection = await createConnection(options);
    const repository: Repository<NodeEntity> = connection.getRepository(
        NodeEntity
    );
    await drop(repository);
    await populate(repository);
})().catch(console.error);
