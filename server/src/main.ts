import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  const limiter = rateLimit({
    max: 100, // 100 requests
    windowMs: 60 * 60 * 1000, // 1 hour
    message:
      'We have received too many requests from this IP. Please try again after one hour.',
  });
  app.use(limiter);
  app.use(helmet());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
