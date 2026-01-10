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
import { User } from './User';
import { Restaurant } from './Restaurant';
import { Package } from './Package';
import { AvailabilitySlot } from './AvailabilitySlot';
import { Message } from './Message';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userAId: string;

  @ManyToOne(() => User, (user) => user.bookingsAsUserA)
  @JoinColumn({ name: 'user_a_id' })
  userA: User;

  @Column()
  userBId: string;

  @ManyToOne(() => User, (user) => user.bookingsAsUserB)
  @JoinColumn({ name: 'user_b_id' })
  userB: User;

  @Column()
  restaurantId: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.bookings)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column()
  packageId: string;

  @ManyToOne(() => Package, (pkg) => pkg.bookings)
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column()
  slotId: string;

  @ManyToOne(() => AvailabilitySlot, (slot) => slot.bookings)
  @JoinColumn({ name: 'slot_id' })
  slot: AvailabilitySlot;

  @OneToMany(() => Message, (message) => message.booking)
  messages: Message[];

  @Column({ type: 'timestamptz' })
  bookingTime: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

  @Column({ nullable: true })
  voucherCode: string;

  @Column({ nullable: true })
  qrCodeUrl: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  confirmedAt: Date;

  @Column({ nullable: true })
  confirmedBy: string;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  cancelledBy: string;

  @Column({ nullable: true })
  cancellationReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  sanitize(): Partial<Booking> {
    const { deletedAt, ...sanitizedBooking } = this;
    return sanitizedBooking;
  }
}