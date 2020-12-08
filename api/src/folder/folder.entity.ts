import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('folder')
export class FolderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}
