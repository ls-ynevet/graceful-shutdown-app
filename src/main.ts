import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  app.enableShutdownHooks();

  console.log('Application is running. Press Ctrl+C to exit.');

  // Keep the application running
}

bootstrap();
