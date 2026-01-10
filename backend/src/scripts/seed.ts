import 'reflect-metadata';
import { createConnection } from 'typeorm';
import dataSource from '../config/database';
import { User } from '../entities/User';
import { Restaurant } from '../entities/Restaurant';
import { Package } from '../entities/Package';
import { logger } from '../utils/logger';
import * as bcrypt from 'bcrypt';

async function seedDatabase() {
  try {
    logger.info('Connecting to database...');
    const connection = await dataSource.initialize();
    
    logger.info('Seeding database...');
    
    // Create sample users
    const users = [
      {
        email: 'john.doe@example.com',
        passwordHash: await bcrypt.hash('Password123!', 12),
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'male',
        bio: 'Software developer who loves trying new restaurants and meeting new people.',
        location: { type: 'Point', coordinates: [-122.4194, 37.7749] }, // San Francisco
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94102',
        interests: ['technology', 'food', 'hiking'],
        languages: ['en'],
        verificationStatus: 'verified',
        isActive: true,
        tokenVersion: 0
      },
      {
        email: 'jane.smith@example.com',
        passwordHash: await bcrypt.hash('Password123!', 12),
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: new Date('1988-08-22'),
        gender: 'female',
        bio: 'Marketing professional with a passion for good food and great conversations.',
        location: { type: 'Point', coordinates: [-122.4194, 37.7749] }, // San Francisco
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94102',
        interests: ['marketing', 'food', 'travel'],
        languages: ['en'],
        verificationStatus: 'verified',
        isActive: true,
        tokenVersion: 0
      }
    ];

    for (const userData of users) {
      const user = connection.getRepository(User).create(userData);
      await connection.getRepository(User).save(user);
      logger.info(`Created user: ${user.email}`);
    }

    // Create sample restaurants
    const restaurants = [
      {
        name: 'Café Luna',
        description: 'Cozy Italian bistro with homemade pasta and authentic flavors.',
        addressLine1: '123 Market St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94105',
        location: { type: 'Point', coordinates: [-122.4005, 37.7910] },
        cuisineType: 'Italian',
        priceRange: '$$' as const,
        capacity: 50,
        is_active: true
      },
      {
        name: 'Bistro Verde',
        description: 'Mediterranean cuisine with fresh, locally-sourced ingredients.',
        addressLine1: '456 Mission St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94105',
        location: { type: 'Point', coordinates: [-122.3990, 37.7850] },
        cuisineType: 'Mediterranean',
        priceRange: '$$' as const,
        capacity: 60,
        is_active: true
      }
    ];

    for (const restaurantData of restaurants) {
      const restaurant = connection.getRepository(Restaurant).create(restaurantData);
      await connection.getRepository(Restaurant).save(restaurant);
      logger.info(`Created restaurant: ${restaurant.name}`);
    }

    // Create sample packages
    const packages = [
      {
        name: 'Romantic Dinner',
        description: 'Three-course dinner for two with wine pairing.',
        price: 150.00,
        duration_hours: 3,
        max_participants: 2,
        is_active: true
      },
      {
        name: 'Dessert & Drinks',
        description: 'After-dinner drinks and dessert experience.',
        price: 75.00,
        duration_hours: 1.5,
        max_participants: 2,
        is_active: true
      }
    ];

    for (const packageData of packages) {
      const packageEntity = connection.getRepository(Package).create(packageData);
      await connection.getRepository(Package).save(packageEntity);
      logger.info(`Created package: ${packageEntity.name}`);
    }

    logger.info('Database seeding completed successfully!');
    await connection.destroy();
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();