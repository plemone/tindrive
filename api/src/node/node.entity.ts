import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('node')
export class NodeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}
