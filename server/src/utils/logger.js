// server/src/utils/logger.js
const winston = require('winston');
const path = require('path');
const env = require('../config/environment');

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack || message}`;
});

const transports = [
  new winston.transports.Console({
    silent: env.NODE_ENV === 'test',
    format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), logFormat),
  }),
];

if (env.NODE_ENV !== 'test') {
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    })
  );
}

const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), logFormat),
  transports,
});

module.exports = logger;
