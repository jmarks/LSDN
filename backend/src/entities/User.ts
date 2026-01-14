import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Point } from 'geojson';
import { UserPackage } from './UserPackage';
import { Booking } from './Booking';
import { Message } from './Message';
import { MatchingRequest } from './MatchingRequest';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  dateOfBirth: Date | undefined;

  @Column({ nullable: true })
  gender: string | null;

  @Column({ type: 'text', nullable: true, length: 150 })
  bio: string | null;

  @Column({ nullable: true })
  profilePhotoUrl: string | null;

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  profilePhotos: string[];

  @Column({ type: 'point' })
  location: Point;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  zipCode: string;

  @Column({ default: 10 })
  radiusPreference: number;

  @Column({ default: 25 })
  ageRangeMin: number;

  @Column({ default: 45 })
  ageRangeMax: number;

  @Column({ type: 'jsonb', default: '[]' })
  interests: string[];

  @Column({ type: 'jsonb', default: '[]' })
  languages: string[];

  @Column({ type: 'jsonb', default: '[]' })
  dietaryRestrictions: string[];

  @Column({ nullable: true })
  verifiedAt: Date | null;

  @Column({ default: 'pending' })
  verificationStatus: 'pending' | 'verified' | 'rejected';

  @Column({ default: 'user' })
  role: 'user' | 'partner' | 'admin' | 'super_admin';

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLoginAt: Date | null;

  @Column({ nullable: true })
  tokenVersion: number | null;

  @Column({ nullable: true })
  totpSecret: string | null;

  @Column({ default: false })
  totpEnabled: boolean;

  @Column({ nullable: true })
  resetToken: string | null;

  @Column({ nullable: true })
  resetTokenExpiry: Date | null;

  @Column({ nullable: true })
  verificationToken: string | null;

  // Relations
  @OneToMany(() => UserPackage, (userPackage) => userPackage.user)
  packages: UserPackage[];

  @OneToMany(() => Booking, (booking) => booking.userA)
  bookingsAsUserA: Booking[];

  @OneToMany(() => Booking, (booking) => booking.userB)
  bookingsAsUserB: Booking[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @OneToMany(() => MatchingRequest, (matchingRequest) => matchingRequest.user)
  matchingRequests: MatchingRequest[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.passwordHash && !this.passwordHash.startsWith('$2b$')) {
      this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.passwordHash);
  }

  get age(): number {
    if (!this.dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  sanitize(): Partial<User> {
    const {
      passwordHash,
      totpSecret,
      tokenVersion,
      deletedAt,
      ...sanitizedUser
    } = this;
    return sanitizedUser;
  }
}