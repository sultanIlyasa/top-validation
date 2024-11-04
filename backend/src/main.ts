import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000', // frontend url here
    credentials: true, // enable credentials
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
