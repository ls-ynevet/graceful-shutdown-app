import { Module } from '@nestjs/common';
import { MyModule } from './my/my.module';

@Module({
  imports: [MyModule],
})
export class AppModule {}
