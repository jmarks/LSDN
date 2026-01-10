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
import { Booking } from './Booking';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  senderId: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column()
  receiverId: string;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @Column({ nullable: true })
  bookingId: string;

  @ManyToOne(() => Booking, (booking) => booking.messages)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Column({ type: 'text' })
  messageText: string;

  @Column({ default: 'text' })
  messageType: 'text' | 'image' | 'system';

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  readAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  sanitize(): Partial<Message> {
    const { deletedAt, ...sanitizedMessage } = this;
    return sanitizedMessage;
  }
}