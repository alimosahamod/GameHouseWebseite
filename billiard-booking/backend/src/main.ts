import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS aktivieren für Frontend
  app.enableCors({
    origin: 'http://localhost:4200', // Angular Dev Server
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Backend läuft auf http://localhost:${port}`);
}
bootstrap();
