// server/src/config/config.js
require('dotenv').config();

const sharedDialectOptions = {
  charset: 'utf8mb4',
  decimalNumbers: true,
};

module.exports = {
  development: {
    username: process.env.DB_USER || 'ecommerce_user',
    password: process.env.DB_PASSWORD || 'ecommerce_pass',
    database: process.env.DB_NAME || 'ecommerce_fashion',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3307,
    dialect: 'mysql',
    dialectOptions: sharedDialectOptions,
    logging: false,
    timezone: '+07:00',
  },
  test: {
    username: process.env.DB_USER || 'ecommerce_user',
    password: process.env.DB_PASSWORD || 'ecommerce_pass',
    database: process.env.DB_NAME_TEST || 'ecommerce_fashion_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3307,
    dialect: 'mysql',
    dialectOptions: sharedDialectOptions,
    logging: false,
    timezone: '+07:00',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    dialectOptions: sharedDialectOptions,
    logging: false,
    timezone: '+07:00',
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
  },
};
