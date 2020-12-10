import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { FileService } from './file.service';
import { FileSystemResolver } from './fs.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([FileEntity])],
    providers: [FileService, FileSystemResolver],
})
export class FileSystemModule {}
