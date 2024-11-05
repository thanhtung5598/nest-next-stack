import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupNestApplication } from './libs/utils/nest-application-setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'],
  });
  const globalPrefix = 'api';

  const config = new DocumentBuilder().setTitle('BitA Devices Management').addBearerAuth().build();

  app.setGlobalPrefix(globalPrefix);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  setupNestApplication(app);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;

  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
