import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService<Env, true> = app.get(ConfigService);
  const port = configService.get('PORT', { infer: true });
  console.log(`Application is running on: http://localhost:${port}`);
  await app.listen(port);
}
bootstrap();
