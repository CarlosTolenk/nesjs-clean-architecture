import { Test, TestingModule } from '@nestjs/testing';
import {
  HealthCheckService,
  TerminusModule,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { HealthController } from '../../../src/modules/health/health.controller';
import { SharedModule } from '../../../src/modules/shared/shared.module';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthCheckService;
  let database: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule, SharedModule],
      controllers: [HealthController],
    }).compile();

    await module.init();
    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthCheckService>(HealthCheckService);
    database = module.resolve<any>(TypeOrmHealthIndicator);
  });

  it('should defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(database).toBeDefined();
  });

  it('should return OK when hit checkReadiness', async () => {
    const expected = { details: {}, error: {}, info: {}, status: 'ok' };
    jest
      .spyOn(await database, 'pingCheck')
      .mockReturnValue(Promise.resolve({ database: { status: 'up' } }));
    jest
      .spyOn(service, 'check')
      .mockReturnValue(
        Promise.resolve({ details: {}, error: {}, info: {}, status: 'ok' }),
      );

    const response = await controller.checkReadiness();

    expect(response).toBeDefined();
    expect(response).toEqual(expected);
  });

  it('should throw error when hit checkReadiness', async () => {
    jest
      .spyOn(service, 'check')
      .mockReturnValue(Promise.reject(new Error('Error to hit health')));

    try {
      await controller.checkReadiness();
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toEqual('Error to hit health');
    }
  });

  it('should return OK when hit checkLiveness', async () => {
    const expected = { details: {}, error: {}, info: {}, status: 'ok' };
    jest
      .spyOn(service, 'check')
      .mockReturnValue(
        Promise.resolve({ details: {}, error: {}, info: {}, status: 'ok' }),
      );

    const response = await controller.checkLiveness();

    expect(response).toBeDefined();
    expect(response).toEqual(expected);
  });

  it('should throw error when hit checkLiveness', async () => {
    jest.spyOn(service, 'check').mockReturnValue(Promise.reject());

    try {
      await controller.checkLiveness();
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toEqual('Error to hit liveness');
    }
  });
});
