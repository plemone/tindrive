import { Module } from '@nestjs/common';
import { FileSystemResolver } from './fs.resolver';

@Module({
    providers: [FileSystemResolver],
})
export class FileSystemModule {}
