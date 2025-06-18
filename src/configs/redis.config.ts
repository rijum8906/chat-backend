import Redis from "ioredis";

const { REDIS_USERNAME, REDIS_PASSWORD, REDIS_PORT, REDIS_URL } = process.env;

export const redisClient = new Redis({
  host: REDIS_URL,
  port: REDIS_PORT,
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD
});

export const getRedisValue = async (key: string) => {
  return await redisClient.get(key);
}

export const compareRedisKey = async (key: string, value: string) => {
  const keyVal = await redisClient.get(key);
  return value === keyVal;
};