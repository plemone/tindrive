import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { FileService } from './file.service';
import { FileResolver } from './file.resolver';

interface Mock {
    find: jest.Mock<any[], [entity: any]>;
}

export const repositoryMockFactory: () => Mock = jest.fn(() => ({
    find: jest.fn((entity) => [entity]),
}));

describe('FileResolver', () => {
    let service: FileService;
    let resolver: FileResolver;
    let repository: any;
    const files = [
        {
            name: 'file-a',
            path: './file-a',
            isDirectory: true,
            extension: null,
            createdDate: '2020-11-05T03:03:46.950Z',
            parentDirectory: '.',
            populatedDate: '2020-12-13T18:10:38.000Z',
            size: 4096,
        },
        {
            name: 'file-b',
            path: './file-b',
            isDirectory: true,
            extension: null,
            createdDate: '2020-11-05T05:34:51.219Z',
            parentDirectory: '.',
            populatedDate: '2020-12-13T18:10:38.000Z',
            size: 4096,
        },
        {
            name: 'file-c',
            path: './file-c',
            isDirectory: true,
            extension: null,
            createdDate: '2020-11-10T01:40:14.560Z',
            parentDirectory: '.',
            populatedDate: '2020-12-13T18:10:38.000Z',
            size: 4096,
        },
    ];

    const getRepository: any = (module: TestingModule, data: []) => {
        const repository = module.get(getRepositoryToken(FileEntity));
        repository.find.mockReturnValue(data);
        return repository;
    };

    const getResolver: any = (module: TestingModule) => {
        return module.get<FileResolver>(FileResolver);
    };

    const getService: any = (module: TestingModule, data: []) => {
        return module.get<FileService>(FileService);
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FileResolver,
                FileService,
                {
                    provide: getRepositoryToken(FileEntity),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();
        repository = getRepository(module, files);
        resolver = getResolver(module);
        service = getService(module);
    });

    test('ls', async () => {
        const spy = jest.spyOn(service, 'findByParentDirectory');
        let testPath = '.';
        expect(await resolver.ls(testPath)).toEqual(files);
        expect(repository.find).toHaveBeenCalledWith({
            where: { parentDirectory: testPath },
        });
        expect(repository.find).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(testPath);

        testPath = './';
        expect(await resolver.ls(testPath)).toEqual(files);
        expect(repository.find).not.toHaveBeenCalledWith({
            where: { parentDirectory: testPath },
        });
        expect(repository.find).toHaveBeenCalledWith({
            where: { parentDirectory: testPath.replace('/', '') },
        });
        expect(repository.find).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(testPath);

        testPath = './dotfiles/';
        expect(await resolver.ls(testPath)).toEqual(files);
        expect(repository.find).not.toHaveBeenCalledWith({
            where: { parentDirectory: testPath },
        });
        expect(repository.find).toHaveBeenCalledWith({
            where: { parentDirectory: testPath.replace('s/', 's') },
        });
        expect(repository.find).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenCalledWith(testPath);

        testPath = './dotfiles';
        expect(await resolver.ls(testPath)).toEqual(files);
        expect(repository.find).toHaveBeenCalledWith({
            where: { parentDirectory: testPath },
        });
        expect(repository.find).toHaveBeenCalledTimes(4);
        expect(spy).toHaveBeenCalledTimes(4);
        expect(spy).toHaveBeenCalledWith(testPath);
    });
});
