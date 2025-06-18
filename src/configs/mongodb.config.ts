import mongoose from "mongoose";

export const connectMongoDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.log(err.message);
    });
}