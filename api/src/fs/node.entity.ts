import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity('node')
export class NodeEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('text')
    name: string;

    @Column({
        type: 'text',
        unique: true,
    })
    path: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    extension: string;

    @Column('text')
    directory: boolean;

    @Column('text')
    parentDir: string;

    @Column('datetime')
    createdDate: Date;

    @Column('integer')
    size: number;

    @CreateDateColumn()
    populatedDate: Date;
}
