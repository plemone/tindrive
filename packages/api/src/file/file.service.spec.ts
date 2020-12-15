import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { FileService } from './file.service';

interface Mock {
    find: jest.Mock<any[], [entity: any]>;
}

export const repositoryMockFactory: () => Mock = jest.fn(() => ({
    find: jest.fn((entity) => [entity]),
}));

describe('FileService', () => {
    let service: FileService;
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

    const getService: any = (module: TestingModule) => {
        return module.get<FileService>(FileService);
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                // Service that we are going to test.
                FileService,
                // The mocks of the dependency injections within service.
                {
                    // The mock for this.fileRepository within FileService.
                    provide: getRepositoryToken(FileEntity),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();
        // Retrieve the instantiated service and repository.
        service = getService(module);
        repository = getRepository(module, files);
    });

    it('findByParentDirectory', async () => {
        let testPath = '.';
        expect(await service.findByParentDirectory(testPath)).toEqual(files);
        expect(repository.find).toHaveBeenCalledWith({
            where: { parentDirectory: testPath },
        });
        testPath = './';
        expect(await service.findByParentDirectory(testPath)).toEqual(files);
        expect(repository.find).toHaveBeenCalledWith({
            where: { parentDirectory: testPath.replace('/', '') },
        });
        testPath = './dotfiles/';
        expect(await service.findByParentDirectory(testPath)).toEqual(files);
        expect(repository.find).toHaveBeenCalledWith({
            where: { parentDirectory: testPath.replace('s/', 's') },
        });
        testPath = './dotfiles';
        expect(await service.findByParentDirectory(testPath)).toEqual(files);
        expect(repository.find).toHaveBeenCalledWith({
            where: { parentDirectory: testPath },
        });
    });
});
