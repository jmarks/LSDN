import 'reflect-metadata';
import dataSource from '../config/database';
import { User } from '../entities/User';
import { Restaurant } from '../entities/Restaurant';
import { Package } from '../entities/Package';
import { AvailabilitySlot } from '../entities/AvailabilitySlot';
import { logger } from '../utils/logger';
import * as bcrypt from 'bcrypt';
import { Point } from 'geojson';

async function seedDatabase() {
  try {
    logger.info('Connecting to database...');
    const connection = await dataSource.initialize();

    logger.info('Seeding Santa Cruz database...');

    // Create SC Test User
    const scUser = {
      email: 'sc.tester@example.com',
      passwordHash: await bcrypt.hash('Password123!', 12),
      firstName: 'Santa',
      lastName: 'Cruz',
      dateOfBirth: new Date('1995-01-01'),
      gender: 'other',
      bio: 'LSDN tester living in beautiful Santa Cruz.',
      location: { type: 'Point' as const, coordinates: [-122.0308, 36.9741] }, // Santa Cruz
      city: 'Santa Cruz',
      state: 'CA',
      country: 'USA',
      zipCode: '95060',
      interests: ['surfing', 'coffee', 'redwoods'],
      languages: ['en'],
      verificationStatus: 'verified' as const,
      isActive: true,
      tokenVersion: 0
    };

    const existingUser = await connection.getRepository(User).findOne({
      where: { email: scUser.email }
    });

    if (!existingUser) {
      const user = connection.getRepository(User).create(scUser);
      await connection.getRepository(User).save(user);
      logger.info(`Created test user: ${user.email}`);
    }

    const santaCruzRestaurants = [
      {
        name: 'The Picnic Basket',
        description: 'Local favorite for sandwiches and ice cream near the Boardwalk.',
        addressLine1: '125 Beach St',
        city: 'Santa Cruz',
        state: 'CA',
        country: 'USA',
        zipCode: '95060',
        location: { type: 'Point', coordinates: [-122.023, 36.964] } as Point,
        cuisineType: 'American',
        priceRange: '$$' as const,
        capacity: 30,
        partnerStatus: 'approved' as const
      },
      {
        name: 'Laili',
        description: 'Silken Silk Road flavors in a hidden Mediterranean courtyard.',
        addressLine1: '101 Cooper St',
        city: 'Santa Cruz',
        state: 'CA',
        country: 'USA',
        zipCode: '95060',
        location: { type: 'Point', coordinates: [-122.026, 36.973] } as Point,
        cuisineType: 'Mediterranean',
        priceRange: '$$$' as const,
        capacity: 50,
        partnerStatus: 'approved' as const
      },
      {
        name: 'Shadowbrook Restaurant',
        description: 'Iconic fine dining reachable via a cable car funicular.',
        addressLine1: '1750 Wharf Rd',
        city: 'Capitola',
        state: 'CA',
        country: 'USA',
        zipCode: '95010',
        location: { type: 'Point', coordinates: [-121.954, 36.975] } as Point,
        cuisineType: 'Steakhouse',
        priceRange: '$$$$' as const,
        capacity: 100,
        partnerStatus: 'approved' as const
      },
      {
        name: 'Akira Santa Cruz',
        description: 'Creative sushi and Japanese small plates.',
        addressLine1: '1222 Soquel Ave',
        city: 'Santa Cruz',
        state: 'CA',
        country: 'USA',
        zipCode: '95062',
        location: { type: 'Point', coordinates: [-122.010, 36.976] } as Point,
        cuisineType: 'Japanese',
        priceRange: '$$$' as const,
        capacity: 40,
        partnerStatus: 'approved' as const
      }
    ];

    for (const rData of santaCruzRestaurants) {
      let restaurant = await connection.getRepository(Restaurant).findOne({
        where: { name: rData.name }
      });

      if (!restaurant) {
        restaurant = connection.getRepository(Restaurant).create(rData);
        await connection.getRepository(Restaurant).save(restaurant);
        logger.info(`Created restaurant: ${restaurant.name}`);
      }

      // Create a default package for each restaurant
      const pkgName = `${restaurant.name} Date Night`;
      let pkg = await connection.getRepository(Package).findOne({
        where: { name: pkgName, restaurantId: restaurant.id }
      });

      if (!pkg) {
        const basePrice = rData.priceRange === '$$$$' ? 150 : (rData.priceRange === '$$$' ? 100 : 60);
        pkg = connection.getRepository(Package).create({
          restaurantId: restaurant.id,
          name: pkgName,
          description: `Curated ${rData.cuisineType} experience for two.`,
          price: basePrice,
          serviceFeePercentage: 100.00,
          totalPrice: basePrice * 2,
          experienceType: 'dinner',
          durationMinutes: 90,
          isActive: true
        });
        await connection.getRepository(Package).save(pkg);
        logger.info(`Created package for: ${restaurant.name}`);
      }

      // Create availability slots for the next 7 days if none exist
      const existingSlots = await connection.getRepository(AvailabilitySlot).count({
        where: { restaurantId: restaurant.id }
      });

      if (existingSlots === 0) {
        const slots = [];
        for (let i = 1; i <= 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          date.setHours(19, 0, 0, 0); // 7:00 PM

          slots.push(connection.getRepository(AvailabilitySlot).create({
            restaurantId: restaurant.id,
            packageId: pkg.id,
            startTime: date,
            endTime: new Date(date.getTime() + 90 * 60000),
            capacity: 4,
            currentBookings: 0,
            isActive: true
          }));
        }
        await connection.getRepository(AvailabilitySlot).save(slots);
        logger.info(`Created slots for: ${restaurant.name}`);
      }
    }

    logger.info('Santa Cruz seeding completed successfully!');
    await connection.destroy();
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();