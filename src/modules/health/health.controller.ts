import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

// Domain
import { ILogger } from '../shared/domain/Logger';

@ApiTags('Health Check')
@Controller('')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private readonly logger: ILogger,
    private database: TypeOrmHealthIndicator,
  ) {}

  @Get('health')
  @HealthCheck()
  async checkReadiness() {
    try {
      return this.health.check([() => this.database.pingCheck('database')]);
    } catch (error) {
      return this.logger.error('Error to hit health', { error });
    }
  }

  @Get('liveness')
  @HealthCheck()
  async checkLiveness() {
    try {
      return await this.health.check([]);
    } catch (error) {
      return this.logger.error('Error to hit liveness', { error });
    }
  }
}
