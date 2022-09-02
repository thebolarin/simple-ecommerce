import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('Starting...');

  const keys = [
    "MONGO_URI", "JWT_KEY", "JWT_REFRESH_KEY", "S3_ACCESS_KEY_ID", 
    "S3_SECRET_ACCESS_KEY", "S3_BUCKET", "S3_REGION", "REDIS_PORT", 
    "REDIS_HOST", "REDIS_URL"
  ];

  for(let key of keys){
    if (!process.env[key]) {
      throw new Error(`${key} must be defined`);
    }
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