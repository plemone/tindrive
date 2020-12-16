import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

/**
 * This class represents the schema for the file table and dto for graphql
 */
@ObjectType()
@Entity('file')
export class FileEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Field()
    @Column('text')
    name: string;

    @Field()
    @Column({
        type: 'text',
        unique: true,
    })
    path: string;

    @Field({ nullable: true })
    @Column({
        type: 'text',
        nullable: true,
    })
    extension: string;

    @Field()
    @Column('boolean')
    isDirectory: boolean;

    @Field()
    @Column('text')
    parentDirectory: string;

    @Field()
    @Column('datetime')
    createdDate: Date;

    @Field(() => Int)
    @Column('integer')
    size: number;

    @Field()
    @CreateDateColumn()
    populatedDate: Date;
}
