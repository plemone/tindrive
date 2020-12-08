import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class FileResolver {
    @Query(() => String)
    async hello() {
        return 'Hello World';
    }
}
