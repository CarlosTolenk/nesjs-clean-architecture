import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';

// Domain
import { ILogger } from '../../../../../src/modules/shared/domain/Logger';
import { MakeCallRepository } from '../../../../../src/modules/phoneCall/domain/MakeCallRepository';
import { InfrastructureError } from '../../../../../src/modules/shared/domain/exception';
import { PayloadMakeCall } from '../../../../../src/modules/phoneCall/domain/valueObject/PayloadMakeCall';

// Infrastructure
import { MakeCallRepositoryApi } from '../../../../../src/modules/phoneCall/infrastructure/service/MakeCallRepositoryApi';
import { GenerateWithSR } from '../../../../../src/modules/shared/infrastructure/http/headers/GenerateWithSR';

// Config
import { ConfigEnvService } from '../../../../../src/modules/config/ConfigEnvService';
import config from '../../../../../src/assets/default.json';

describe('MakeCallRepositoryApi', () => {
  let makeCallRepositoryApi: MakeCallRepository;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: MakeCallRepository,
          useClass: MakeCallRepositoryApi,
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: ConfigEnvService,
          useFactory: () => ({
            getConfig: jest.fn(() => config),
          }),
        },
        {
          provide: ILogger,
          useFactory: () => ({
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          }),
        },
        {
          provide: GenerateWithSR,
          useFactory: () => ({
            getHeaders: jest.fn(() => 'headers'),
          }),
        },
      ],
    }).compile();

    makeCallRepositoryApi =
      moduleRef.get<MakeCallRepository>(MakeCallRepository);
    httpService = moduleRef.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(makeCallRepositoryApi).toBeDefined();
    expect(httpService).toBeDefined();
  });

  it('should return a true value when invoking the send method when the correct message body is called', async () => {
    const payloadMakeCall = new PayloadMakeCall({
      shippingGroupId: '12345',
      customerCellphone: '56952158950',
      pickerCellphone: '56952158951',
      customerId: 'customerId',
    });

    const mockResponse: AxiosResponse = {
      config: undefined,
      data: {
        status: 200,
        error: null,
        data: {
          notification: {
            id: 'notificationId',
          },
        },
      },
      status: HttpStatus.OK,
      statusText: 'OK',
      headers: {},
    };

    const httpServiceMock = jest
      .spyOn(httpService, 'post')
      .mockReturnValueOnce(of(mockResponse));

    await makeCallRepositoryApi.execute(payloadMakeCall);

    expect(httpServiceMock).toHaveBeenCalledWith(
      'https://twilio.com/v1/calls',
      expect.objectContaining({
        channel: 'PICKING',
        event: 'LIDER_CALL_SOD_PICKING_SUBSTITUTION',
        key: '12345',
        key_complement: expect.any(String),
        customer: {
          cellphone: '56952158950',
        },
        from: {
          cellphone: '56952158951',
        },
      }),
      {
        headers: expect.any(String),
      },
    );
  });

  it('should throw error when error is any', async () => {
    const payloadMakeCall = new PayloadMakeCall({
      shippingGroupId: '12345',
      customerCellphone: '56952158950',
      pickerCellphone: '56952158951',
      customerId: 'customerId',
    });

    const mockError = new Error('Request Infrastructure error');
    jest.spyOn(httpService, 'post').mockReturnValue(throwError(mockError));

    try {
      await makeCallRepositoryApi.execute(payloadMakeCall);
    } catch (error) {
      expect(error).toBeInstanceOf(InfrastructureError);
      expect(error?.message).toBe('Request Infrastructure error');
    }
  });

  it('should throw error when error is InfrastructureError', async () => {
    const payloadMakeCall = new PayloadMakeCall({
      shippingGroupId: '12345',
      customerCellphone: '56952158950',
      pickerCellphone: '56952158951',
      customerId: 'customerId',
    });

    const mockError = new InfrastructureError(
      'Request Infrastructure error',
      HttpStatus.BAD_REQUEST,
    );
    jest.spyOn(httpService, 'post').mockReturnValue(throwError(mockError));

    try {
      await makeCallRepositoryApi.execute(payloadMakeCall);
    } catch (error) {
      expect(error).toBeInstanceOf(InfrastructureError);
      expect(error?.message).toBe('Request Infrastructure error');
    }
  });
});
