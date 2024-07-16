import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { IResult } from '../../../../src/modules/featuresFlag/interfaces';
import {
  FeaturesFlagService,
  SocketService,
} from '../../../../src/modules/featuresFlag/services';
import { ConfigEnvService } from '../../../../src/modules/config/ConfigEnvService';

// Config
import config from '../../../../src/assets/default.json';
import { SharedModule } from '../../../../src/modules/shared/shared.module';

const resultSocket: IResult = {
  status: 'OK',
  data: {
    pickingContactability: {
      example: {
        hello: 'world',
      },
      socket: {
        enable: true,
      },
    },
  },
};

jest.mock('socket.io-client', () => {
  return {
    io: jest.fn().mockImplementation(() => {
      return {
        on: jest.fn().mockImplementation(() => resultSocket),
      };
    }),
  };
});

describe('SocketService', () => {
  let service: SocketService;
  let featuresFlagService: FeaturesFlagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, SharedModule],
      providers: [
        SocketService,
        FeaturesFlagService,
        {
          provide: ConfigEnvService,
          useFactory: () => ({
            getConfig: jest.fn(() => config),
          }),
        },
      ],
    }).compile();

    await module.init();
    service = module.get<SocketService>(SocketService);
    featuresFlagService = module.get<FeaturesFlagService>(FeaturesFlagService);
  });

  it('should defined', () => {
    expect(service).toBeDefined();
  });

  describe('onInit', () => {
    it('should connection in socket', async () => {
      const onConnectionSpy = jest
        .spyOn(service, 'onConnection')
        .mockImplementation(() => Promise.resolve(resultSocket));

      service.onInit();

      expect(onConnectionSpy).toHaveBeenCalled();
    });

    it('should throw error connection in socket', async () => {
      jest
        .spyOn(service, 'onConnection')
        .mockImplementation(() =>
          Promise.reject(new Error('Some error message')),
        );

      await expect(async () => {
        await service.onInit();
      }).rejects.toThrowError('Some error message');
    });
  });
});
