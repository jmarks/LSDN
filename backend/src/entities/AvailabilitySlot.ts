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
import { Package } from './Package';
import { Booking } from './Booking';

@Entity('availability_slots')
export class AvailabilitySlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restaurantId: string;

  @ManyToOne(() => Restaurant, (restaurant: Restaurant) => restaurant.availabilitySlots)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column()
  packageId: string;

  @ManyToOne(() => Package, (pkg: Package) => pkg.availabilitySlots)
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  endTime: Date;

  @Column()
  capacity: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: false })
  isBlackout: boolean;

  @Column({ nullable: true })
  blackoutReason: string;

  @OneToMany(() => Booking, (booking: Booking) => booking.slot)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  get availableCount(): number {
    // This will be calculated based on bookings
    return this.capacity;
  }

  sanitize(): Partial<AvailabilitySlot> {
    const { deletedAt, ...sanitizedSlot } = this;
    return sanitizedSlot;
  }
}