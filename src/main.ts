import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './common/config/app.config';
import { SwaggerConfig } from './common/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfig(app);
  AppConfig(app);
  await app.listen(3002);
}
bootstrap();
