import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnApplicationShutdown {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
      db: 0,
      maxRetriesPerRequest: null,
    });
    console.log('RedisService: Connected to Redis.');
  }

  getClient(): Redis {
    return this.client;
  }

  async onApplicationShutdown(signal?: string) {
    console.log(`RedisService: onApplicationShutdown (${signal})`);
    await this.client.quit();
    console.log('RedisService: Redis connection closed.');
  }
}
