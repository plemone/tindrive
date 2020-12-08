import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { FileResolver } from './file.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([FileEntity])],
    providers: [FileResolver],
})
export class FileModule {}
