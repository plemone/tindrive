import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { FileSystemModule } from './fs/fs.module';
import { NodeModule } from './node/node.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        FileSystemModule,
        NodeModule,
        GraphQLModule.forRoot({ autoSchemaFile: 'schema.gpl' }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
