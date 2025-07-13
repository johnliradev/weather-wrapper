import { createClient } from "redis";

const redisClient = createClient();

redisClient.connect().catch(console.error);

export const setCityForecast = async (
  key: string,
  value: object
): Promise<void> => {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: 3600, // Expira em 1 hora (3600 segundos)
    });
    console.log(`Forecast set for city: ${key}`);
  } catch (error) {
    console.error(`Error setting forecast for city ${key}:`, error);
    throw error;
  }
};

export const getCityForecast = async (key: string): Promise<object | null> => {
  try {
    const result = await redisClient.get(key);
    if (result) {
      return JSON.parse(result);
    }
    return null;
  } catch (error) {
    console.error(`Error getting forecast for city ${key}:`, error);
    throw error;
  }
};

export const closeRedisConnection = async (): Promise<void> => {
  await redisClient.quit();
};

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client Connected"));
redisClient.on("ready", () => console.log("Redis Client Ready"));
