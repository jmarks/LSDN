import { MigrationInterface, QueryRunner } from "typeorm";

export class OnboardingRedesign1737591000000 implements MigrationInterface {
    name = 'OnboardingRedesign1737591000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create interest_tags table
        await queryRunner.query(`
            CREATE TABLE "interest_tags" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(50) NOT NULL,
                "created_by_user_id" uuid,
                "is_system_tag" boolean NOT NULL DEFAULT false,
                "usage_count" integer NOT NULL DEFAULT 0,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_interest_tags_name" UNIQUE ("name"),
                CONSTRAINT "PK_interest_tags" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_interest_tags_name" ON "interest_tags" ("name")
        `);

        await queryRunner.query(`
            ALTER TABLE "interest_tags" 
            ADD CONSTRAINT "FK_interest_tags_user" 
            FOREIGN KEY ("created_by_user_id") 
            REFERENCES "users"("id") 
            ON DELETE SET NULL 
            ON UPDATE NO ACTION
        `);

        // Create user_packages table
        await queryRunner.query(`
            CREATE TABLE "user_packages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "package_id" uuid NOT NULL,
                "dates_purchased" integer NOT NULL,
                "dates_used" integer NOT NULL DEFAULT 0,
                "purchase_date" TIMESTAMP NOT NULL DEFAULT now(),
                "status" character varying NOT NULL DEFAULT 'active',
                "expires_at" TIMESTAMP,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_user_packages" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "user_packages" 
            ADD CONSTRAINT "FK_user_packages_user" 
            FOREIGN KEY ("user_id") 
            REFERENCES "users"("id") 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "user_packages" 
            ADD CONSTRAINT "FK_user_packages_package" 
            FOREIGN KEY ("package_id") 
            REFERENCES "packages"("id") 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
        `);

        // Create shopping_cart table
        await queryRunner.query(`
            CREATE TABLE "shopping_cart" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "package_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_shopping_cart_user" UNIQUE ("user_id"),
                CONSTRAINT "PK_shopping_cart" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "shopping_cart" 
            ADD CONSTRAINT "FK_shopping_cart_user" 
            FOREIGN KEY ("user_id") 
            REFERENCES "users"("id") 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "shopping_cart" 
            ADD CONSTRAINT "FK_shopping_cart_package" 
            FOREIGN KEY ("package_id") 
            REFERENCES "packages"("id") 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
        `);

        // Add new columns to users table
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "avatar_id" character varying(50),
            ADD COLUMN "onboarding_step" character varying NOT NULL DEFAULT 'registration',
            ADD COLUMN "onboarding_completed_at" TIMESTAMP
        `);

        // Add new columns to bookings table for invite tracking
        await queryRunner.query(`
            ALTER TABLE "bookings" 
            ADD COLUMN "inviter_id" uuid,
            ADD COLUMN "invite_status" character varying NOT NULL DEFAULT 'pending',
            ADD COLUMN "invited_at" TIMESTAMP,
            ADD COLUMN "responded_at" TIMESTAMP
        `);

        await queryRunner.query(`
            ALTER TABLE "bookings" 
            ADD CONSTRAINT "FK_bookings_inviter" 
            FOREIGN KEY ("inviter_id") 
            REFERENCES "users"("id") 
            ON DELETE SET NULL 
            ON UPDATE NO ACTION
        `);

        // Seed system interest tags
        await queryRunner.query(`
            INSERT INTO "interest_tags" ("name", "is_system_tag", "usage_count") VALUES
            ('Hiking', true, 0),
            ('Reading', true, 0),
            ('Cooking', true, 0),
            ('Traveling', true, 0),
            ('Photography', true, 0),
            ('Music', true, 0),
            ('Movies', true, 0),
            ('Fitness', true, 0),
            ('Art', true, 0),
            ('Sports', true, 0),
            ('Gaming', true, 0),
            ('Yoga', true, 0),
            ('Writing', true, 0),
            ('Gardening', true, 0),
            ('Dancing', true, 0),
            ('Sky Diving', true, 0),
            ('Antique Cars', true, 0),
            ('Wine Tasting', true, 0),
            ('Live Music', true, 0),
            ('Coffee', true, 0),
            ('Beach Walks', true, 0),
            ('Board Games', true, 0),
            ('Craft Beer', true, 0),
            ('Cycling', true, 0),
            ('Volunteering', true, 0)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove foreign keys
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_bookings_inviter"`);
        await queryRunner.query(`ALTER TABLE "shopping_cart" DROP CONSTRAINT "FK_shopping_cart_package"`);
        await queryRunner.query(`ALTER TABLE "shopping_cart" DROP CONSTRAINT "FK_shopping_cart_user"`);
        await queryRunner.query(`ALTER TABLE "user_packages" DROP CONSTRAINT "FK_user_packages_package"`);
        await queryRunner.query(`ALTER TABLE "user_packages" DROP CONSTRAINT "FK_user_packages_user"`);
        await queryRunner.query(`ALTER TABLE "interest_tags" DROP CONSTRAINT "FK_interest_tags_user"`);

        // Drop new columns from bookings
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "responded_at"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "invited_at"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "invite_status"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "inviter_id"`);

        // Drop new columns from users
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "onboarding_completed_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "onboarding_step"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar_id"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "shopping_cart"`);
        await queryRunner.query(`DROP TABLE "user_packages"`);
        await queryRunner.query(`DROP INDEX "IDX_interest_tags_name"`);
        await queryRunner.query(`DROP TABLE "interest_tags"`);
    }
}
