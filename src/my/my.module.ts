import { Module } from '@nestjs/common';
import { MyService } from './my.service';
import { JobProducer } from './job.producer';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [MyService, JobProducer],
  exports: [MyService, JobProducer],
})
export class MyModule {}
