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

  @Column({ name: 'user_a_id' })
  userAId: string;

  @ManyToOne(() => User, (user) => user.bookingsAsUserA)
  @JoinColumn({ name: 'user_a_id' })
  userA: User;

  @Column({ name: 'user_b_id' })
  userBId: string;

  @ManyToOne(() => User, (user) => user.bookingsAsUserB)
  @JoinColumn({ name: 'user_b_id' })
  userB: User;

  @Column({ name: 'restaurant_id' })
  restaurantId: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.bookings)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ name: 'package_id' })
  packageId: string;

  @ManyToOne(() => Package, (pkg) => pkg.bookings)
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column({ name: 'slot_id' })
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

  @Column({ name: 'inviter_id', type: 'uuid', nullable: true })
  inviterId: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inviter_id' })
  inviter: User;

  @Column({ name: 'invite_status', type: 'varchar', default: 'pending' })
  inviteStatus: 'pending' | 'accepted' | 'declined';

  @Column({ name: 'invited_at', type: 'timestamp', nullable: true })
  invitedAt: Date | null;

  @Column({ name: 'responded_at', type: 'timestamp', nullable: true })
  respondedAt: Date | null;

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

  sanitize(): any {
    const { userA, userB, restaurant, package: pkg, slot, messages, inviter, deletedAt, ...sanitizedBooking } = this as any;
    return sanitizedBooking;
  }
}