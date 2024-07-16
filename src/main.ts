import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import './utils/initial-values';

// Domain
import { ILogger } from './modules/shared/domain/Logger';

// Infrastructure
import { LoggerWinston } from './modules/shared/infrastructure/logger/loggerWinston';
import { HttpExceptionFilter } from './modules/shared/infrastructure/http/filter/HttpExceptionFilter';

// Modules
import { AppModule } from './app.module';
import { FeaturesFlagModule } from './modules/featuresFlag/featuresFlag.module';

import { traceability } from './modules/metrics/traceability';

const logger: ILogger = new LoggerWinston();
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function bootstrap() {
  try {
    if (!AppModule.isDevelopment) {
      const socket = await NestFactory.create(FeaturesFlagModule, {
        logger: ['verbose'],
      }).then((socket) => {
        logger.info(`Feature flags is running`);
        return socket;
      });

      await socket.init().catch((error) => {
        logger.error(`Error starting socket server ${error?.message}`, {
          error,
        });
      });
    }

    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.use(traceability);

    const config = new DocumentBuilder()
      .setTitle('Contactability')
      .setDescription('Contactability ....')
      .setVersion('1.0')
      .addTag('Health Check')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(AppModule.port).then(() => {
      logger.info(`Server started on port: ${AppModule.port}`);
    });
  } catch (error) {
    logger.error('Error starting server', { error });
  }
}

bootstrap()
  .then(() => {
    logger.info(`Cluster ID: ${process.env.cluster_id}`);
    logger.info(`Cluster Profile: ${process.env.cluster_profile}`);
    logger.info(`Stage Name: ${process.env.stage_name}`);
    logger.info(`Namespace: ${process.env.namespace}`);
    logger.info(`Hostname: ${process.env.hostname}`);
    logger.info(`Server is running`);
  })
  .catch((error) => logger.error('Error starting server', { error }));
