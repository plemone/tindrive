import { Test, TestingModule } from '@nestjs/testing';
import { FileEntity } from './file.entity';
import { FileSystemService } from './fs.service';

describe('FileService', () => {
    let fs: FileSystemService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FileSystemService],
        }).compile();
        fs = module.get<FileSystemService>(FileSystemService);
    });

    test('pwd', () => {
        const root = `${__dirname}/../../../../../`;
        expect(fs.pwd()).toEqual(root);
        fs.cd(__dirname);
        expect(fs.pwd()).toEqual(__dirname);
        fs.cd('~');
        expect(fs.pwd()).toEqual(root);
    });

    test('cd', () => {
        const root = `${__dirname}/../../../../../`;
        expect(fs.pwd()).toEqual(root);
        fs.cd(__dirname);
        expect(fs.pwd()).toEqual(__dirname);
        fs.cd('~');
        expect(fs.pwd()).toEqual(root);
        const invalidPath = './thisthingismadeupandshouldneverexist';
        expect(() => fs.cd(invalidPath)).toThrow(
            `Directory ${invalidPath} does not exists`
        );
    });

    test('ls', () => {
        // TODO - Need to create test folders outside of the test project to properly test.
        fs.cd(__dirname);
        const files: FileEntity[] = fs.ls();
        expect(files).toEqual([]);
    });
});
