import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Point } from 'geojson';
import { Package } from './Package';
import { AvailabilitySlot } from './AvailabilitySlot';
import { Booking } from './Booking';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  zipCode: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  location: Point;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column()
  cuisineType: string;

  @Column()
  priceRange: '$' | '$$' | '$$$' | '$$$$';

  @Column()
  capacity: number;

  @Column({ default: 'pending' })
  partnerStatus: 'pending' | 'approved' | 'rejected';

  @Column({ nullable: true })
  stripeAccountId: string;

  @Column({ nullable: true })
  posSystemId: string;

  @Column({ nullable: true })
  posSystemType: 'toast' | 'square' | 'other';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  // Relations
  @OneToMany(() => Package, pkg => pkg.restaurant)
  packages: Package[];

  @OneToMany(() => AvailabilitySlot, slot => slot.restaurant)
  availabilitySlots: AvailabilitySlot[];

  @OneToMany(() => Booking, booking => booking.restaurant)
  bookings: Booking[];

  get distance(): number | null {
    // This will be calculated dynamically based on user location
    return null;
  }

  get rating(): number {
    // This will be calculated based on reviews
    return 0;
  }

  get reviewsCount(): number {
    // This will be calculated based on reviews
    return 0;
  }

  sanitize(): Partial<Restaurant> {
    const { deletedAt, ...sanitizedRestaurant } = this;
    return sanitizedRestaurant;
  }
}