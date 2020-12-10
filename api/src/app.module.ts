import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileSystemModule } from './fs/fs.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        FileSystemModule,
        GraphQLModule.forRoot({ autoSchemaFile: 'schema.gpl' }),
    ],
})
export class AppModule {}
