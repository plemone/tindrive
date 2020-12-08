import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class FileSystemResolver {
    @Query(() => String)
    async hello() {
        return 'Hello World';
    }
}
