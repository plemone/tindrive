import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './file/file.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        GraphQLModule.forRoot({ autoSchemaFile: 'schema.gpl' }),
        FileModule,
    ],
})
export class AppModule {}
