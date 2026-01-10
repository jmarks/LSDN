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
import { Package } from './Package';

@Entity('user_packages')
export class UserPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.packages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  packageId: string;

  @ManyToOne(() => Package, (pkg) => pkg.userPackages)
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column()
  quantity: number;

  @Column({ type: 'timestamptz' })
  purchasedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date;

  @Column()
  remainingUnits: number;

  @Column({ default: 'active' })
  status: 'active' | 'expired' | 'cancelled';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  sanitize(): Partial<UserPackage> {
    const { deletedAt, ...sanitizedUserPackage } = this;
    return sanitizedUserPackage;
  }
}