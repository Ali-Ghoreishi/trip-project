import Redis from 'ioredis';

let client = new Redis({
  enableOfflineQueue: true
  // keyPrefix: keyPrefix,
  // db: 1
});

export default class redis {
  async Set(key: string, value: any, ...args: any) {
    return await client.set(key, JSON.stringify(value), ...args);
  }
  async Replace(key: string, value: any) {
    return await client.multi().del(key).set(key, JSON.stringify(value)).exec();
  }
  async Get(key: string) {
    const value = await client.get(key);
    if (value === null) {
      return null
    }
    return JSON.parse(value);
  }
  async Keys(key: string) {
    return await client.keys(key);
  }
  async Delete(key: string) {
    return await client.del(key);
  }
  async has(key: string) {
    return await client.exists(key);
  }
}
