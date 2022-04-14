import winston, { info } from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'log/info.log', level: 'info' }),
    new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
  ],
});

if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.json(),
  }));
}

export default logger;
