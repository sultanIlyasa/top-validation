import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000', // frontend url here
    credentials: true, // enable credentials
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
