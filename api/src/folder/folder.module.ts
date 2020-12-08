import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderEntity } from './folder.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FolderEntity])],
})
export class FolderModule {}
