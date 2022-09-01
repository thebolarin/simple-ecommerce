import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('Starting...');

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.JWT_REFRESH_KEY) {
    throw new Error('JWT_REFRESH_KEY must be defined');
  }
  if (!process.env.S3_ACCESS_KEY_ID) {
    throw new Error('S3_ACCESS_KEY_ID must be defined');
  }
  if (!process.env.S3_SECRET_ACCESS_KEY) {
    throw new Error('S3_SECRET_ACCESS_KEY must be defined');
  }
  if (!process.env.S3_BUCKET) {
    throw new Error('S3_BUCKET must be defined');
  }
  if (!process.env.S3_REGION) {
    throw new Error('S3_REGION must be defined');
  }
  if (!process.env.REDIS_PORT) {
    throw new Error('REDIS_PORT must be defined');
  }
  if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST must be defined');
  }
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(app.get("port"), () => {
    console.log(`Listening on port ${app.get("port")}!`);
  });
};

start();