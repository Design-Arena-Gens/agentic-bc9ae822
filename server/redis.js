import { Redis } from '@upstash/redis';

let redisClient = null;

export function getRedis() {
  if (redisClient) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    redisClient = new Redis({ url, token });
  }
  return redisClient;
}

const memoryStore = new Map();

export async function getKey(key) {
  const redis = getRedis();
  if (redis) {
    try { return await redis.get(key); } catch { /* fallthrough */ }
  }
  return memoryStore.get(key) ?? null;
}

export async function setKey(key, value, ttlSeconds = 7 * 24 * 3600) {
  const redis = getRedis();
  if (redis) {
    try { await redis.set(key, value, { ex: ttlSeconds }); return; } catch { /* fallthrough */ }
  }
  memoryStore.set(key, value);
}

export async function delKey(key) {
  const redis = getRedis();
  if (redis) {
    try { await redis.del(key); return; } catch { /* fallthrough */ }
  }
  memoryStore.delete(key);
}
