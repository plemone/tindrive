import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { FileService } from './file.service';
import { FileSystemService } from './fs.service';
import { FileResolver } from './file.resolver';

/**
 * Class used to encapsulate the dependencies required for the file module
 */
@Module({
    imports: [TypeOrmModule.forFeature([FileEntity])],
    providers: [FileService, FileResolver, FileSystemService],
})
export class FileModule {}
