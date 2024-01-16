import Redis from 'ioredis';

export default class ExRedis {
  client: Redis;
  expireDate:  string;
  sub: Redis;
  constructor(keyPrefix: string, expireDate = '2678400') {
    let redisOptions = {
      enableOfflineQueue: true,
      keyPrefix: keyPrefix
      // db: 1
    };
    this.client = new Redis(redisOptions);

    this.expireDate = expireDate;

    this.sub = new Redis(redisOptions);
    this.sub.on('ready', () => {
      this.sub.config('SET', 'notify-keyspace-events', 'KEA');
      this.sub.psubscribe('__keyevent@*__:expired');
    });
  }

  async Set(key: string, value: any) {
    return await this.client.set(key, JSON.stringify(value), 'EX', this.expireDate);
  }
  async Replace(key: string, value: any) {
    return await this.client.multi().del(key).set(key, value, 'EX', this.expireDate).exec();
  }
  async Get(key: string) {
    let value: any = await this.client.get(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  async Delete(key: string) {
    return await this.client.del(key);
  }
  async has(key: string) {
    return await this.client.exists(key);
  }

  /**
     * , async (channel, message) => {
          // Handle event
        }
     */
  async onExpire(callback: any) {
    this.sub.on('pmessage', async (channel, event, key) => {
      if (event.includes('expired')) {
        await callback(key);
      }
    });
  }
};
