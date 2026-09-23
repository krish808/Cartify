import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";

let replSet;

export const connectTestDb = async () => {
  replSet = await MongoMemoryReplSet.create();
  const uri = replSet.getUri();
  await mongoose.connect(uri);
};

export const disconnectTestDb = async () => {
  await mongoose.disconnect();
  if (replSet) await replSet.stop();
};

export const clearTestDb = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};