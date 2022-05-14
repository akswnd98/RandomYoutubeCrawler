import winston from 'winston';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const winstonErrorFormat = winston.format((info) => {
  if (info instanceof Error && info.stack !== undefined) {
    return {
      ...info,
      message: info.stack,
    };
  } else {
    return info;
  }
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.resolve(__dirname, '../..', 'log/info.log'), level: 'info' }),
    new winston.transports.File({
      filename: path.resolve(__dirname, '../..', 'log/error.log'),
      level: 'error',
      format: winston.format.combine(winston.format.errors({ stack: true }), winstonErrorFormat()),
    }),
  ],
});

if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.json(),
  }));
}

export default logger;
