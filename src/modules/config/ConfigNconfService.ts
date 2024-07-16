import { Injectable } from '@nestjs/common';
import nconf from 'nconf';
import { IConfigEnv } from './ConfigInterface';
import { ConfigEnvService } from './ConfigEnvService';

@Injectable()
export class ConfigNconfService extends ConfigEnvService {
  constructor() {
    super();
  }

  getConfig(): IConfigEnv {
    return nconf.get() as IConfigEnv;
  }

  setConfig(key: string, value: any): void {
    nconf.set(key, value);
  }
}
