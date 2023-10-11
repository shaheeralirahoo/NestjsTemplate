import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger, configValidation } from './core/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(configValidation);
  configSwagger(app);
  app.useStaticAssets(join(__dirname, '..', 'public'),{
    prefix: '/public/',
  });
  await app.listen(parseInt(process.env.PORT) || 5000);
}
bootstrap(); 