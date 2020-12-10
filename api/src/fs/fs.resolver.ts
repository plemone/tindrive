import { Resolver, Query, Args } from '@nestjs/graphql';
import { FileEntity } from './file.entity';
import { FileService } from './file.service';

@Resolver(() => FileEntity)
export class FileSystemResolver {
    constructor(private readonly fileService: FileService) {}

    @Query(() => [FileEntity])
    async ls(@Args('path') path: string) {
        return this.fileService.findByParentDirectory(path);
    }
}
