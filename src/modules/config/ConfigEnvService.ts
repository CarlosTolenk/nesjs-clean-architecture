import { IConfigEnv } from './ConfigInterface';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ConfigEnvService {
  abstract getConfig(): IConfigEnv;

  abstract setConfig(key: string, value: any): void;
}
