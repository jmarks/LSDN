import * as winston from 'winston';
import * as path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each log level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which logs to show based on the environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define different log formats for console and file
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info: any) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define transports (where logs go)
const transports = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
    level: level()
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format: fileFormat
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    format: fileFormat
  })
];

// Create the logger
export const logger = winston.createLogger({
  level: level(),
  levels,
  format: fileFormat,
  transports,
  exitOnError: false
});

// If we're not in production then log to the `console` with the format:
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Create a stream object with a 'write' function that will be used by `morgan`
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  }
};