import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class FolderResolver {
    @Query(() => String)
    async hello() {
        return 'Hello World';
    }
}
