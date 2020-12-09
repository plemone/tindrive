import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeEntity } from './node.entity';

@Module({
    imports: [TypeOrmModule.forFeature([NodeEntity])],
})
export class NodeModule {}
