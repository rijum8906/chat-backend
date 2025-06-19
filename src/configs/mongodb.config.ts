import mongoose from 'mongoose';
import { getEnv } from '@/configs/env.config';

export const connectMongoDB = async () => {
  await mongoose
    .connect(getEnv("MONGO_URI"))
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
      console.log(err.message);
    });
};
