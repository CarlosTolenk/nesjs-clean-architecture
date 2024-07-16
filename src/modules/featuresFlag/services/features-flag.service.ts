import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { merge, pick } from 'lodash';

// Interfaces
import { IConfigMap, IResult, IResultSocket } from '../interfaces';
import { MappingModel } from '../../../utils/dynamicMapping';
import { ConfigEnvService } from '../../config/ConfigEnvService';
import { ILogger } from '../../shared/domain/Logger';

const KEY_ARTEFACT = 'contactability';

@Injectable()
export class FeaturesFlagService {
  constructor(
    private readonly _httService: HttpService,
    private readonly _configEnvService: ConfigEnvService,
    private readonly logger: ILogger,
  ) {}

  fallbackRest(): Promise<void> {
    return new Promise(async (resolve) => {
      const { endpoint, pathEndpoint } =
        this._configEnvService.getConfig().socket;
      this._httService
        .get<IResultSocket>(`${endpoint}/${pathEndpoint}`)
        .subscribe(
          async ({ data }) => {
            await this.setConfigMaps(data);
            this.logger.info(`Updated configurations features flags`);
            resolve();
          },
          (error) => {
            this.logger.error(
              `The features flags artifact request failed and the default configurations maps had to be used ${error?.message}`,
              {
                error,
              },
            );
            resolve();
          },
        );
    });
  }

  isWriteInConfigMapsEnvironment(resultSocket: IResult): boolean {
    const { data } = this.pickFeatureFlagForUse(resultSocket);
    const amida: any = data[KEY_ARTEFACT];
    const mappingModel = new MappingModel<IConfigMap>();
    const amidaAdminFeaturesFlags = mappingModel.select(amida);
    return amidaAdminFeaturesFlags.socket.enable;
  }

  setConfigMaps(result: IResultSocket): Promise<void> {
    return new Promise((resolve) => {
      const { data, keys } = this.pickFeatureFlagForUse(result);
      keys.forEach((currentKey) => {
        const currentObject = data[currentKey];

        const sourceKeyEnvironment = this._configEnvService.getConfig();
        const mergedKeys = merge(sourceKeyEnvironment, currentObject);
        this.setConfigurationInEnvironment(mergedKeys);
      });

      resolve();
    });
  }

  pickFeatureFlagForUse(result: IResultSocket): {
    data: { [key: string]: string };
    keys: string[];
  } {
    const { data } = result as IResult;
    const { indexKeys } = this._configEnvService.getConfig().socket;
    const featuresFlags = pick(data, indexKeys);
    const keys = Object.keys(featuresFlags);
    return { data: featuresFlags, keys };
  }

  setConfigurationInEnvironment(newObject: any) {
    const arrayKeys = Object.entries(newObject);
    arrayKeys.forEach(([key, value]) =>
      this._configEnvService.setConfig(key, value),
    );
  }
}
