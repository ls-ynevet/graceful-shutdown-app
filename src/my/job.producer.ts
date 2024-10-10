import { Injectable, OnApplicationShutdown, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class JobProducer implements OnApplicationShutdown {
  private queue: Queue;
  private isProducing = true; // Flag to control the job production loop
  private logger = new Logger(JobProducer.name);

  constructor(private readonly redisService: RedisService) {
    const connection = this.redisService.getClient();
    this.queue = new Queue('my-queue', { connection });
    this.logger.log('Initialized.');

    // Start producing jobs indefinitely
    this.startProducingJobs();
  }

  private async startProducingJobs() {
    let jobId = 1;
    while (this.isProducing) {
      await this.addJob({ message: `Job message ${jobId}` });
      jobId++;

      // Wait for a certain interval before adding the next job
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    this.logger.log('Job production loop has exited.');
  }

  private async addJob(data: any) {
    try {
      const job = await this.queue.add('my-job', data);
      this.logger.log(`Added job ${job.id} to the queue.`);
    } catch (error) {
      this.logger.error('Error adding job to the queue:', error);
    }
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(`onApplicationShutdown (${signal})`);
    this.isProducing = false; // Stop the job production loop

    // Wait for the job production loop to exit
    await new Promise((resolve) => setTimeout(resolve, 500));

    await this.queue.close();
    this.logger.log('Queue has been closed.');
  }
}
