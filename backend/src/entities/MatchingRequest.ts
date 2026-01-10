import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './User';

@Entity('matching_requests')
export class MatchingRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.matchingRequests)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamptz' })
  preferredTimeStart: Date;

  @Column({ type: 'timestamptz' })
  preferredTimeEnd: Date;

  @Column({ type: 'jsonb' })
  experienceTypes: string[];

  @Column()
  maxDistance: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'matched' | 'expired';

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  sanitize(): Partial<MatchingRequest> {
    const { deletedAt, ...sanitizedMatchingRequest } = this;
    return sanitizedMatchingRequest;
  }
}