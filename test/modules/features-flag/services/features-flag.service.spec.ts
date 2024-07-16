import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';

// Config

import config from '../../../../src/assets/default.json';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';

import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';
import { FeaturesFlagService } from '../../../../src/modules/featuresFlag/services';
import { ConfigEnvService } from '../../../../src/modules/config/ConfigEnvService';
import { IResult } from '../../../../src/modules/featuresFlag/interfaces';
import { SharedModule } from '../../../../src/modules/shared/shared.module';

describe('FeaturesFlagService', () => {
  let httService: HttpService;
  let featuresFlagService: FeaturesFlagService;
  let configEnvService: ConfigEnvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, SharedModule],
      providers: [
        FeaturesFlagService,
        {
          provide: ConfigEnvService,
          useFactory: () => ({
            getConfig: jest.fn(() => config),
            setConfig: jest.fn(),
          }),
        },
      ],
    }).compile();

    await module.init();
    httService = module.get<HttpService>(HttpService);
    featuresFlagService = module.get<FeaturesFlagService>(FeaturesFlagService);
    configEnvService = module.get<ConfigEnvService>(ConfigEnvService);
  });

  it('should defined', () => {
    expect(featuresFlagService).toBeDefined();
  });

  describe('fallbackRest', () => {
    it('should call the set configuration method when an answer is correct', async () => {
      const data = {
        data: {},
      };

      const responseHttp: AxiosResponse<any> = {
        data,
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl' },
        status: 200,
        statusText: 'OK',
      };
      jest
        .spyOn(httService, 'get')
        .mockImplementationOnce(() => of(responseHttp));
      const setConfigMapsSpy = jest.spyOn(featuresFlagService, 'setConfigMaps');

      await featuresFlagService.fallbackRest();

      expect(setConfigMapsSpy).toHaveBeenCalled();
    });

    it('should not call the set configuration method when the answer is incorrect', async () => {
      const errorHttp: AxiosError = {
        code: '500',
        name: '',
        message: 'Error service hurricane',
        response: {
          data: {},
          status: 500,
          statusText: '',
          headers: {},
          config: {},
        },
        isAxiosError: true,
        toJSON: () => null,
      };
      jest
        .spyOn(httService, 'get')
        .mockImplementationOnce(() => throwError(errorHttp));
      const setConfigMapsSpy = jest.spyOn(featuresFlagService, 'setConfigMaps');

      await featuresFlagService.fallbackRest();

      expect(setConfigMapsSpy).not.toHaveBeenCalled();
    });
  });

  describe('isWriteInConfigMapsEnvironment', () => {
    it('should validate if it is activated in CCM2 to update the configurations', () => {
      const resultSocket: IResult = {
        status: 'OK',
        data: {
          contactability: {
            socket: {
              enable: true,
            },
          },
        },
      };

      const response =
        featuresFlagService.isWriteInConfigMapsEnvironment(resultSocket);

      expect(response).toBeTruthy();
    });

    it('should validate if it is not activated in CCM2 to not update the configurations', () => {
      const resultSocket: IResult = {
        status: 'OK',
        data: {
          contactability: {
            socket: {
              enable: false,
            },
          },
        },
      };

      const response =
        featuresFlagService.isWriteInConfigMapsEnvironment(resultSocket);

      expect(response).toBeFalsy();
    });
  });

  describe('setConfigMaps', () => {
    it('should call the set configuration in environment method', async () => {
      const resultSocket: IResult = {
        status: 'OK',
        data: {
          contactability: {
            example: {
              hello: 'world',
            },
            socket: {
              enable: true,
            },
          },
        },
      };
      const setConfigurationInEnvironmentMock = jest.spyOn(
        featuresFlagService,
        'setConfigurationInEnvironment',
      );
      const expectedParams = {
        ...config,
        example: {
          hello: 'world',
        },
      };

      await featuresFlagService.setConfigMaps(resultSocket);

      expect(setConfigurationInEnvironmentMock).toHaveBeenCalled();
      expect(setConfigurationInEnvironmentMock).toHaveBeenCalledWith(
        expectedParams,
      );
    });
  });
});
