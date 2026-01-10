import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { User } from '../entities/User';
import { Restaurant } from '../entities/Restaurant';
import { Package } from '../entities/Package';
import { MenuItem } from '../entities/MenuItem';
import { AvailabilitySlot } from '../entities/AvailabilitySlot';
import { Booking } from '../entities/Booking';
import { UserPackage } from '../entities/UserPackage';
import { Message } from '../entities/Message';
import { MatchingRequest } from '../entities/MatchingRequest';

// Log the database configuration for debugging
console.log('Database configuration:');
console.log('  Host:', process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost');
console.log('  Port:', process.env.DB_PORT || process.env.POSTGRES_PORT || '5432');
console.log('  Username:', process.env.DB_USER || process.env.POSTGRES_USER || 'lsdn_user');
console.log('  Database:', process.env.DB_NAME || process.env.POSTGRES_DB || 'lsdn_db');
console.log('  Environment:', process.env.NODE_ENV || 'development');

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432'),
  username: process.env.DB_USER || process.env.POSTGRES_USER || 'lsdn_user',
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'lsdn_password',
  database: process.env.DB_NAME || process.env.POSTGRES_DB || 'lsdn_db',
  entities: [
    User,
    Restaurant,
    Package,
    MenuItem,
    AvailabilitySlot,
    Booking,
    UserPackage,
    Message,
    MatchingRequest
  ],
  migrations: [__dirname + '/../migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  extra: {
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
  }
});

export default dataSource;