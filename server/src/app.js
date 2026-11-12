// server/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const env = require('./config/environment');
const HTTP_CODES = require('./constants/httpCodes');
const ApiError = require('./utils/ApiError');
const { apiRateLimiter } = require('./middlewares/rateLimiter');
const errorMiddleware = require('./middlewares/errorMiddleware');
const routes = require('./routes');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

app.use('/api/v1', apiRateLimiter, routes);

app.use((req, res, next) => {
  next(new ApiError(HTTP_CODES.NOT_FOUND, `Không tìm thấy đường dẫn ${req.originalUrl}`));
});

app.use(errorMiddleware);

module.exports = app;
