import winston from 'winston';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.resolve(__dirname, '../..', 'log/info.log'), level: 'info' }),
    new winston.transports.File({
      filename: path.resolve(__dirname, '../..', 'log/error.log'),
      level: 'error',
      format: winston.format.combine(winston.format.errors({ stack: true }), winston.format.prettyPrint()),
    }),
  ],
});

if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    level: 'info',
    format: winston.format.json(),
  }));
  logger.add(new winston.transports.Console({
    level: 'error',
    format: winston.format.combine(winston.format.prettyPrint()),
  }));
}

export default logger;
