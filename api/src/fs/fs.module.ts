import { Module } from '@nestjs/common';
import { FileSystemResolver } from './fs.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeEntity } from './node.entity';

@Module({
    imports: [TypeOrmModule.forFeature([NodeEntity])],
    providers: [FileSystemResolver],
})
export class FileSystemModule {}
