import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

// Domain
import { ILogger } from '../shared/domain/Logger';

// Modules
import { SharedModule } from '../shared/shared.module';
import { ConfigModule } from '../config/config.module';

// Services
import { FeaturesFlagService, SocketService } from './services';
import { IResultSocket } from './interfaces';

@Module({
  imports: [HttpModule, SharedModule, ConfigModule],
  providers: [FeaturesFlagService, SocketService],
})
export class FeaturesFlagModule implements OnModuleInit {
  constructor(
    private readonly socketService: SocketService,
    private readonly featuresFlagService: FeaturesFlagService,
    private readonly logger: ILogger,
  ) {}

  onModuleInit(): Promise<void> {
    return new Promise(async (resolve) => {
      try {
        const result: IResultSocket = await this.socketService.onInit();
        await this.featuresFlagService.setConfigMaps(result);
        this.logger.info(`Updated configurations features flags`);
        resolve();
      } catch (error) {
        this.logger.error(
          `Applying fallback because websocket failed connection ${error?.message}`,
          { error },
        );
        await this.featuresFlagService.fallbackRest();
        resolve();
      }
    });
  }
}
