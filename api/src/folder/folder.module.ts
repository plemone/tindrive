import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderEntity } from './folder.entity';
import { FolderResolver } from './folder.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([FolderEntity])],
    providers: [FolderResolver],
})
export class FolderModule {}
