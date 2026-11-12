// server/src/config/db.js
const { Sequelize } = require('sequelize');
const env = require('./environment');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4',
    decimalNumbers: true,
  },
  timezone: '+07:00',
  logging: env.NODE_ENV === 'development' ? (msg) => console.debug(msg) : false,
  pool: {
    max: 15,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

module.exports = sequelize;
