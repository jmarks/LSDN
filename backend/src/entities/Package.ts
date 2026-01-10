import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Restaurant } from './Restaurant';
import { MenuItem } from './MenuItem';
import { AvailabilitySlot } from './AvailabilitySlot';
import { Booking } from './Booking';
import { UserPackage } from './UserPackage';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restaurantId: string;

  @ManyToOne(() => Restaurant, (restaurant: Restaurant) => restaurant.packages)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 5, scale: 2, default: 100.00 })
  serviceFeePercentage: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  experienceType: 'dinner' | 'dessert_walk' | 'activity_drink';

  @Column()
  durationMinutes: number;

  @Column({ default: 2 })
  maxParticipants: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  menuItems: MenuItem[];

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => AvailabilitySlot, (slot: AvailabilitySlot) => slot.package)
  availabilitySlots: AvailabilitySlot[];

  @OneToMany(() => Booking, (booking: Booking) => booking.package)
  bookings: Booking[];

  @OneToMany(() => UserPackage, (userPackage: UserPackage) => userPackage.package)
  userPackages: UserPackage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  calculateTotalPrice(): number {
    return this.price * (1 + this.serviceFeePercentage / 100);
  }

  sanitize(): Partial<Package> {
    const { deletedAt, ...sanitizedPackage } = this;
    return sanitizedPackage;
  }
}