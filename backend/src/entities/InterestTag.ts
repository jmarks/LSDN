import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('interest_tags')
export class InterestTag {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    name!: string;

    @Column({ name: 'created_by_user_id', type: 'uuid', nullable: true })
    createdByUserId?: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'created_by_user_id' })
    createdBy?: User;

    @Column({ name: 'is_system_tag', type: 'boolean', default: false })
    isSystemTag!: boolean;

    @Column({ name: 'usage_count', type: 'int', default: 0 })
    usageCount!: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}
