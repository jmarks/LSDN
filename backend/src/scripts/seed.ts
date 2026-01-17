import 'reflect-metadata';
import { createConnection } from 'typeorm';
import dataSource from '../config/database';
import { User } from '../entities/User';
import { Restaurant } from '../entities/Restaurant';
import { Package } from '../entities/Package';
import { logger } from '../utils/logger';
import * as bcrypt from 'bcrypt';
import { Point } from 'geojson';

async function seedDatabase() {
  try {
    logger.info('Connecting to database...');
    const connection = await dataSource.initialize();
    
    logger.info('Seeding database...');
    
    // Create sample users (check if they exist first)
    const users = [
      {
        email: 'john.doe@example.com',
        passwordHash: await bcrypt.hash('Password123!', 12),
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'male',
        bio: 'Software developer who loves trying new restaurants and meeting new people.',
        location: { type: 'Point' as const, coordinates: [-122.4194, 37.7749] }, // San Francisco
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94102',
        interests: ['technology', 'food', 'hiking'],
        languages: ['en'],
        verificationStatus: 'verified' as const,
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
        location: { type: 'Point' as const, coordinates: [-122.4194, 37.7749] }, // San Francisco
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94102',
        interests: ['marketing', 'food', 'travel'],
        languages: ['en'],
        verificationStatus: 'verified' as const,
        isActive: true,
        tokenVersion: 0
      }
    ];

    for (const userData of users) {
      const existingUser = await connection.getRepository(User).findOne({
        where: { email: userData.email }
      });
      
      if (!existingUser) {
        const user = connection.getRepository(User).create(userData);
        await connection.getRepository(User).save(user);
        logger.info(`Created user: ${user.email}`);
      } else {
        logger.info(`User already exists: ${userData.email}`);
      }
    }

    // Create sample restaurants (check if they exist first)
    const restaurants = [
      {
        name: 'Café Luna',
        description: 'Cozy Italian bistro with homemade pasta and authentic flavors.',
        addressLine1: '123 Market St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94105',
        location: { type: 'Point', coordinates: [-122.4005, 37.7910] } as Point,
        cuisineType: 'Italian',
        priceRange: '$$' as const,
        capacity: 50,
        is_active: true as const
      },
      {
        name: 'Bistro Verde',
        description: 'Mediterranean cuisine with fresh, locally-sourced ingredients.',
        addressLine1: '456 Mission St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        zipCode: '94105',
        location: { type: 'Point', coordinates: [-122.3990, 37.7850] } as Point,
        cuisineType: 'Mediterranean',
        priceRange: '$$' as const,
        capacity: 60,
        is_active: true as const
      }
    ];

    for (const restaurantData of restaurants) {
      const existingRestaurant = await connection.getRepository(Restaurant).findOne({
        where: { name: restaurantData.name }
      });
      
      if (!existingRestaurant) {
        const restaurant = connection.getRepository(Restaurant).create(restaurantData);
        await connection.getRepository(Restaurant).save(restaurant);
        logger.info(`Created restaurant: ${restaurant.name}`);
      } else {
        logger.info(`Restaurant already exists: ${restaurantData.name}`);
      }
    }

    // Create sample packages (check if they exist first)
    const [restaurant1, restaurant2] = await connection.getRepository(Restaurant).find();
    
    const packages = [
      {
        restaurantId: restaurant1.id,
        name: 'Romantic Dinner',
        description: 'Three-course dinner for two with wine pairing.',
        price: 150.00,
        serviceFeePercentage: 10.00,
        totalPrice: 165.00,
        experienceType: 'dinner' as const,
        durationMinutes: 180,
        maxParticipants: 2,
        isActive: true as const
      },
      {
        restaurantId: restaurant2.id,
        name: 'Dessert & Drinks',
        description: 'After-dinner drinks and dessert experience.',
        price: 75.00,
        serviceFeePercentage: 10.00,
        totalPrice: 82.50,
        experienceType: 'dessert_walk' as const,
        durationMinutes: 90,
        maxParticipants: 2,
        isActive: true
      }
    ];

    for (const packageData of packages) {
      const existingPackage = await connection.getRepository(Package).findOne({
        where: { name: packageData.name, restaurantId: packageData.restaurantId }
      });
      
      if (!existingPackage) {
        const packageEntity = connection.getRepository(Package).create(packageData);
        await connection.getRepository(Package).save(packageEntity);
        logger.info(`Created package: ${packageEntity.name}`);
      } else {
        logger.info(`Package already exists: ${packageData.name}`);
      }
    }

    logger.info('Database seeding completed successfully!');
    await connection.destroy();
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();