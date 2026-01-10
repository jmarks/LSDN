import 'reflect-metadata';
import { logger } from '../utils/logger';
import dataSource from '../config/database';

async function runMigrations() {
  try {
    logger.info('Connecting to database...');
    logger.info('Using DataSource configuration');
    
    // Use the same DataSource configuration as the main application
    await dataSource.initialize();
    
    logger.info('Running migrations...');
    await dataSource.runMigrations();
    
    logger.info('Migrations completed successfully!');
    await dataSource.destroy();
  } catch (error) {
    logger.error('Migration failed:', error);
    if (error instanceof Error) {
      logger.error('Error details:', error.message);
      logger.error('Error stack:', error.stack);
    }
    process.exit(1);
  }
}

runMigrations();