import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'dev';
dotenv.config({ path: `.env.${env}` });
