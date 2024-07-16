import { Module } from '@nestjs/common';

import { ConfigNconfService } from './ConfigNconfService';
import { ConfigEnvService } from './ConfigEnvService';

@Module({
  providers: [
    {
      provide: ConfigEnvService,
      useClass: ConfigNconfService,
    },
  ],
  exports: [ConfigEnvService],
})
export class ConfigModule {}
