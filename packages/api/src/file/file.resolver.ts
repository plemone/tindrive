import { Resolver, Query, Args } from '@nestjs/graphql';
import { FileEntity } from './file.entity';
import { FileService } from './file.service';

@Resolver(() => FileEntity)
export class FileResolver {
    constructor(private readonly fileService: FileService) {}

    @Query(() => [FileEntity])
    async ls(@Args('path') path: string) {
        return this.fileService.findByParentDirectory(path);
    }
}
