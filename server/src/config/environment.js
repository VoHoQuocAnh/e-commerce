// server/src/config/environment.js
const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  SERVER_URL: z.string().url().default('http://localhost:5000'),

  DB_HOST: z.string().min(1).default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().positive().default(3307),
  DB_NAME: z.string().min(1).default('ecommerce_fashion'),
  DB_USER: z.string().min(1).default('ecommerce_user'),
  DB_PASSWORD: z.string().default('ecommerce_pass'),

  REDIS_HOST: z.string().min(1).default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),

  JWT_ACCESS_SECRET: z
    .string()
    .min(16, 'JWT_ACCESS_SECRET must be at least 16 characters')
    .default('dev_access_secret_key_change_in_prod'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(16, 'JWT_REFRESH_SECRET must be at least 16 characters')
    .default('dev_refresh_secret_key_change_in_prod'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),

  MOMO_PARTNER_CODE: z.string().default('MOMO'),
  MOMO_ACCESS_KEY: z.string().default('F8BBA842ECF85'),
  MOMO_SECRET_KEY: z.string().default('K951B6PE1waDMi640xX08PD3vg6EkVlz'),
  MOMO_ENDPOINT: z.string().url().default('https://test-payment.momo.vn/v2/gateway/api/create'),
  MOMO_REDIRECT_URL: z.string().url().default('http://localhost:5173/payment-result'),
  MOMO_IPN_URL: z.string().url().default('http://localhost:5000/api/v1/payments/momo/ipn'),

  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  EMAIL_FROM: z.string().default('CALEM STUDIO <no-reply@calemstudio.vn>'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

module.exports = parsed.data;
