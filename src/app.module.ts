import {
  HttpStatus,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Domain
import { ILogger } from './modules/shared/domain/Logger';

// Modules
import { HealthModule } from './modules/health/health.module';
import { SharedModule } from './modules/shared/shared.module';
import { ConfigModule } from './modules/config/config.module';
import { PhoneCallModule } from './modules/phoneCall/phoneCall.module';
import { ChatModule } from './modules/chat/chat.module';
import { EventModule } from './modules/event/event.module';

// Infrastructure
import { TrackingMiddleware } from './modules/shared/infrastructure/middleware/Tracking';
import { OutgoingRequestTimingInterceptor } from './modules/shared/infrastructure/interceptors/OutgoingRequestTiming';
import { AzureDatabaseModule } from './modules/shared/infrastructure/persistence/DatabaseModule';

// Config
import { ConfigEnvService } from './modules/config/ConfigEnvService';

@Module({
  imports: [
    HealthModule,
    HttpModule,
    ConfigModule,
    AzureDatabaseModule,
    SharedModule,
    PhoneCallModule,
    ChatModule,
    EventModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: OutgoingRequestTimingInterceptor,
    },
  ],
})
export class AppModule implements OnModuleInit, NestModule {
  static port: number;
  static isDevelopment: boolean;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigEnvService,
    private readonly logger: ILogger,
  ) {
    AppModule.port = this.configService.getConfig().port;
    AppModule.isDevelopment = this.configService.getConfig().isDevelopment;
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TrackingMiddleware).forRoutes('*');
  }

  onModuleInit(): void {
    this.httpService.axiosRef.interceptors.response.use(
      (res) => {
        return res;
      },
      async (error) => {
        if (
          error.code === 'ENOTFOUND' ||
          error.response?.status >= HttpStatus.INTERNAL_SERVER_ERROR
        ) {
          const config = error.config;
          config.headers = error.requests.headers;

          this.logger.info(`Interceptors Headers....`, { ...config.headers });

          config.currentRetryAttempt = config.currentRetryAttempt || 0;
          if (config.currentRetryAttempt <= 5) {
            config.currentRetryAttempt += 1;
            this.logger.info(
              `Error trying to call service ${error.config.url}, retry number ${config.currentRetryAttempt}`,
            );
            await new Promise((f) =>
              setTimeout(f, 500 * config.currentRetryAttempt),
            );
            return this.httpService.axiosRef.request(error.config);
          }
        }
        return Promise.reject(error);
      },
    );
  }
}
