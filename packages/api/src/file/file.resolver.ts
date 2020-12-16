import { Resolver, Query, Args } from '@nestjs/graphql';
import { FileEntity } from './file.entity';
import { FileService } from './file.service';

/**
 * Class is used to resolve graphql queries and provide response for the same
 */
@Resolver(() => FileEntity)
export class FileResolver {
    /**
     * Instantiates the class and performs the necessary dependency injections
     * @param fileService instance of FileService available via dependency injection
     */
    constructor(private readonly fileService: FileService) {}

    /**
     * Function resolves the "ls" graphql query by returning all the files for a given path
     * @param path Path of the directory that is being looked up
     */
    @Query(() => [FileEntity])
    async ls(@Args('path') path: string) {
        return this.fileService.findByParentDirectory(path);
    }
}
