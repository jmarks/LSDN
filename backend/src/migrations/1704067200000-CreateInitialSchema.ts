import { MigrationInterface, QueryRunner, Table, Index, TableForeignKey } from 'typeorm';

export class CreateInitialSchema1704067200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'password_hash',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'date_of_birth',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'bio',
            type: 'text',
            length: '150',
            isNullable: true,
          },
          {
            name: 'profile_photo_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'profile_photos',
            type: 'jsonb',
            default: "'[]'",
          },
          {
            name: 'location',
            type: 'geometry(Point, 4326)',
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'state',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'country',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'zip_code',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'radius_preference',
            type: 'integer',
            default: 10,
          },
          {
            name: 'age_range_min',
            type: 'integer',
            default: 25,
          },
          {
            name: 'age_range_max',
            type: 'integer',
            default: 45,
          },
          {
            name: 'interests',
            type: 'jsonb',
            default: "'[]'",
          },
          {
            name: 'languages',
            type: 'jsonb',
            default: "'[]'",
          },
          {
            name: 'dietary_restrictions',
            type: 'jsonb',
            default: "'[]'",
          },
          {
            name: 'verified_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'verification_status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
          },
          {
            name: 'role',
            type: 'varchar',
            length: '20',
            default: "'user'",
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
            onUpdate: 'NOW()',
          },
          {
            name: 'last_login_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'token_version',
            type: 'integer',
            default: 0,
          },
          {
            name: 'totp_secret',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'totp_enabled',
            type: 'boolean',
            default: false,
          },
          {
            name: 'reset_token',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'reset_token_expiry',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'verification_token',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
        ],
      }),
      true
    );

    // Create indexes for users table
    await queryRunner.createIndex('users', new Index('idx_users_email', ['email']));
    await queryRunner.createIndex('users', new Index('idx_users_location', ['location']));
    await queryRunner.createIndex('users', new Index('idx_users_city_state', ['city', 'state']));
    await queryRunner.createIndex('users', new Index('idx_users_verification_status', ['verification_status']));
    await queryRunner.createIndex('users', new Index('idx_users_role', ['role']));

    // Create restaurants table
    await queryRunner.createTable(
      new Table({
        name: 'restaurants',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'state',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'country',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'zip_code',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'location',
            type: 'geometry(Point, 4326)',
          },
          {
            name: 'cuisine_type',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'price_range',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'rating',
            type: 'decimal',
            precision: 3,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'image_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
            onUpdate: 'NOW()',
          },
        ],
      }),
      true
    );

    // Create indexes for restaurants table
    await queryRunner.createIndex('restaurants', new Index('idx_restaurants_location', ['location']));
    await queryRunner.createIndex('restaurants', new Index('idx_restaurants_city_state', ['city', 'state']));
    await queryRunner.createIndex('restaurants', new Index('idx_restaurants_cuisine_type', ['cuisine_type']));
    await queryRunner.createIndex('restaurants', new Index('idx_restaurants_rating', ['rating']));

    // Create packages table
    await queryRunner.createTable(
      new Table({
        name: 'packages',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'duration_hours',
            type: 'integer',
          },
          {
            name: 'max_participants',
            type: 'integer',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
            onUpdate: 'NOW()',
          },
        ],
      }),
      true
    );

    // Create user_packages table
    await queryRunner.createTable(
      new Table({
        name: 'user_packages',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'package_id',
            type: 'uuid',
          },
          {
            name: 'purchase_date',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'expires_at',
            type: 'timestamp',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'active'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
        ],
      }),
      true
    );

    // Create foreign keys for user_packages
    await queryRunner.createForeignKey(
      'user_packages',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
 
    await queryRunner.createForeignKey(
      'user_packages',
      new TableForeignKey({
        columnNames: ['package_id'],
        referencedTableName: 'packages',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create indexes for user_packages table
    await queryRunner.createIndex('user_packages', new Index('idx_user_packages_user_id', ['user_id']));
    await queryRunner.createIndex('user_packages', new Index('idx_user_packages_package_id', ['package_id']));
    await queryRunner.createIndex('user_packages', new Index('idx_user_packages_expires_at', ['expires_at']));
    await queryRunner.createIndex('user_packages', new Index('idx_user_packages_status', ['status']));

    // Create availability_slots table
    await queryRunner.createTable(
      new Table({
        name: 'availability_slots',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'restaurant_id',
            type: 'uuid',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'start_time',
            type: 'time',
          },
          {
            name: 'end_time',
            type: 'time',
          },
          {
            name: 'max_bookings',
            type: 'integer',
          },
          {
            name: 'current_bookings',
            type: 'integer',
            default: 0,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
            onUpdate: 'NOW()',
          },
        ],
      }),
      true
    );

    // Create foreign key for availability_slots
    await queryRunner.createForeignKey(
      'availability_slots',
      new TableForeignKey({
        columnNames: ['restaurant_id'],
        referencedTableName: 'restaurants',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create indexes for availability_slots table
    await queryRunner.createIndex('availability_slots', new Index('idx_availability_slots_restaurant_id', ['restaurant_id']));
    await queryRunner.createIndex('availability_slots', new Index('idx_availability_slots_date', ['date']));
    await queryRunner.createIndex('availability_slots', new Index('idx_availability_slots_time_range', ['start_time', 'end_time']));

    // Create bookings table
    await queryRunner.createTable(
      new Table({
        name: 'bookings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_a_id',
            type: 'uuid',
          },
          {
            name: 'user_b_id',
            type: 'uuid',
          },
          {
            name: 'restaurant_id',
            type: 'uuid',
          },
          {
            name: 'package_id',
            type: 'uuid',
          },
          {
            name: 'slot_id',
            type: 'uuid',
          },
          {
            name: 'booking_time',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'pending'",
          },
          {
            name: 'confirmed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'cancelled_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'cancelled_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
            onUpdate: 'NOW()',
          },
        ],
      }),
      true
    );

    // Create foreign keys for bookings
    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        columnNames: ['user_a_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
 
    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        columnNames: ['user_b_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
 
    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        columnNames: ['restaurant_id'],
        referencedTableName: 'restaurants',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
 
    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        columnNames: ['package_id'],
        referencedTableName: 'packages',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      })
    );
 
    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        columnNames: ['slot_id'],
        referencedTableName: 'availability_slots',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      })
    );

    // Create indexes for bookings table
    await queryRunner.createIndex('bookings', new Index('idx_bookings_user_a_id', ['user_a_id']));
    await queryRunner.createIndex('bookings', new Index('idx_bookings_user_b_id', ['user_b_id']));
    await queryRunner.createIndex('bookings', new Index('idx_bookings_restaurant_id', ['restaurant_id']));
    await queryRunner.createIndex('bookings', new Index('idx_bookings_status', ['status']));
    await queryRunner.createIndex('bookings', new Index('idx_bookings_booking_time', ['booking_time']));
    await queryRunner.createIndex('bookings', new Index('idx_bookings_confirmed_at', ['confirmed_at']));

    // Create messages table
    await queryRunner.createTable(
      new Table({
        name: 'messages',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'sender_id',
            type: 'uuid',
          },
          {
            name: 'receiver_id',
            type: 'uuid',
          },
          {
            name: 'booking_id',
            type: 'uuid',
          },
          {
            name: 'message',
            type: 'text',
          },
          {
            name: 'is_read',
            type: 'boolean',
            default: false,
          },
          {
            name: 'read_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
        ],
      }),
      true
    );

    // Create foreign keys for messages
    await queryRunner.createForeignKey(
      'messages',
      new TableForeignKey({
        columnNames: ['sender_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
 
    await queryRunner.createForeignKey(
      'messages',
      new TableForeignKey({
        columnNames: ['receiver_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
 
    await queryRunner.createForeignKey(
      'messages',
      new TableForeignKey({
        columnNames: ['booking_id'],
        referencedTableName: 'bookings',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create indexes for messages table
    await queryRunner.createIndex('messages', new Index('idx_messages_sender_id', ['sender_id']));
    await queryRunner.createIndex('messages', new Index('idx_messages_receiver_id', ['receiver_id']));
    await queryRunner.createIndex('messages', new Index('idx_messages_booking_id', ['booking_id']));
    await queryRunner.createIndex('messages', new Index('idx_messages_created_at', ['created_at']));
    await queryRunner.createIndex('messages', new Index('idx_messages_is_read', ['is_read']));

    // Create matching_requests table
    await queryRunner.createTable(
      new Table({
        name: 'matching_requests',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'preferred_gender',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'preferred_age_min',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'preferred_age_max',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'preferred_interests',
            type: 'jsonb',
            default: "'[]'",
          },
          {
            name: 'preferred_languages',
            type: 'jsonb',
            default: "'[]'",
          },
          {
            name: 'preferred_dietary_restrictions',
            type: 'jsonb',
            default: "'[]'",
          },
          {
            name: 'preferred_location',
            type: 'geometry(Point, 4326)',
            isNullable: true,
          },
          {
            name: 'preferred_radius',
            type: 'integer',
            default: 10,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'pending'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
            onUpdate: 'NOW()',
          },
        ],
      }),
      true
    );

    // Create foreign key for matching_requests
    await queryRunner.createForeignKey(
      'matching_requests',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create indexes for matching_requests table
    await queryRunner.createIndex('matching_requests', new Index('idx_matching_requests_user_id', ['user_id']));
    await queryRunner.createIndex('matching_requests', new Index('idx_matching_requests_status', ['status']));
    await queryRunner.createIndex('matching_requests', new Index('idx_matching_requests_preferred_location', ['preferred_location']));
    await queryRunner.createIndex('matching_requests', new Index('idx_matching_requests_created_at', ['created_at']));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order to handle foreign key dependencies
    await queryRunner.dropTable('matching_requests', true);
    await queryRunner.dropTable('messages', true);
    await queryRunner.dropTable('bookings', true);
    await queryRunner.dropTable('availability_slots', true);
    await queryRunner.dropTable('user_packages', true);
    await queryRunner.dropTable('packages', true);
    await queryRunner.dropTable('restaurants', true);
    await queryRunner.dropTable('users', true);
  }
}