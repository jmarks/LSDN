import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Package } from './Package';

export type UserPackageStatus = 'active' | 'exhausted' | 'expired' | 'cancelled';

@Entity('user_packages')
export class UserPackage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.packages)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'package_id' })
  packageId!: string;

  @ManyToOne(() => Package, (pkg) => pkg.userPackages)
  @JoinColumn({ name: 'package_id' })
  package!: Package;

  @Column({ name: 'dates_purchased', type: 'int' })
  datesPurchased!: number;

  @Column({ name: 'dates_used', type: 'int', default: 0 })
  datesUsed!: number;

  @Column({ name: 'purchase_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  purchaseDate!: Date;

  @Column({ type: 'varchar', default: 'active' })
  status!: UserPackageStatus;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Virtual property for dates remaining
  get datesRemaining(): number {
    return this.datesPurchased - this.datesUsed;
  }

  // Check if package is available for use
  get isAvailable(): boolean {
    if (this.status !== 'active') return false;
    if (this.datesRemaining <= 0) return false;
    const now = new Date();
    if (this.expiresAt && now > this.expiresAt) return false;
    return true;
  }

  sanitize(): any {
    const { user, package: pkg, ...sanitizedUserPackage } = this as any;
    return sanitizedUserPackage;
  }
}