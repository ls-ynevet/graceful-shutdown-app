import { Injectable, BeforeApplicationShutdown } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MyService implements BeforeApplicationShutdown {
  private worker: Worker;

  constructor(private readonly redisService: RedisService) {
    console.log('MyService: Initializing BullMQ worker...');
    this.setupWorker();
  }

  private setupWorker() {
    const connection = this.redisService.getClient();

    this.worker = new Worker(
      'my-queue',
      async (job: Job) => {
        // Job processing logic
        console.log(`MyService: Processing job ${job.id} with data`, job.data);
        // Simulate job processing time
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log(`MyService: Job ${job.id} completed.`);
      },
      { connection },
    );

    this.worker.on('error', (error) => {
      console.error('MyService: Worker encountered an error', error);
    });

    console.log('MyService: Worker is listening for jobs.');
  }

  async beforeApplicationShutdown(signal?: string) {
    console.log(`MyService: beforeApplicationShutdown (${signal})`);
    await this.worker.close(); // Gracefully close the worker
    console.log('MyService: Worker has been closed.');
  }
}
