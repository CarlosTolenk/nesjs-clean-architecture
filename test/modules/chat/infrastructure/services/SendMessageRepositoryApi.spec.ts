import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';

// Domain
import { SendMessageRepository } from '../../../../../src/modules/chat/domain/SendMessageRepository';
import { BodyInitialMessage } from '../../../../../src/modules/chat/domain/templates/BodyInitialMessage';
import { PayloadInitialMessage } from '../../../../../src/modules/chat/domain/templates/payloads/PayloadInitialMessage';
import { ILogger } from '../../../../../src/modules/shared/domain/Logger';
import { PayloadFinishedMessage } from '../../../../../src/modules/chat/domain/templates/payloads/PayloadFinishedMessage';
import { BodyFinishedMessage } from '../../../../../src/modules/chat/domain/templates/BodyFinishedMessage';
import { PayloadSubstitutionMessage } from '../../../../../src/modules/chat/domain/templates/payloads/PayloadSubstitutionMessage';
import { BodySubstitutionMessage } from '../../../../../src/modules/chat/domain/templates/BodySubstitutionMessage';

// Infrastructure
import { SendMessageRepositoryApi } from '../../../../../src/modules/chat/infrastructure/services/SendMessageRepositoryApi';
import { GenerateWithSR } from '../../../../../src/modules/shared/infrastructure/http/headers/GenerateWithSR';

// Config
import config from '../../../../../src/assets/default.json';
import { ConfigEnvService } from '../../../../../src/modules/config/ConfigEnvService';
import { InfrastructureError } from '../../../../../src/modules/shared/domain/exception';

describe('SendMessageRepositoryApi', () => {
  let sendMessageRepository: SendMessageRepository;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: SendMessageRepository,
          useClass: SendMessageRepositoryApi,
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

    sendMessageRepository = moduleRef.get<SendMessageRepository>(
      SendMessageRepository,
    );
    httpService = moduleRef.get<HttpService>(HttpService);
  });

  it('should defined', () => {
    expect(sendMessageRepository).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('BodyInitialMessage', () => {
    it('should return a true value when invoking the send method when the correct message body is sent - BodyInitialMessage', async () => {
      const payload = new PayloadInitialMessage({
        customerFirstName: 'John',
        callOptionButton: 'callOptionButton',
        chooseForMeOptionButton: 'chooseForMeOptionButton',
        refundOptionButton: 'refundOptionButton',
      });
      const bodyInitialMessage = new BodyInitialMessage({
        shippingGroupId: '12345',
        firstName: 'John',
        cellphone: '56952158950',
        customerId: 'customerId',
        payload: payload,
      });

      const mockResponse: AxiosResponse = {
        config: undefined,
        data: {
          status: 200,
          error: null,
          data: {},
        },
        status: HttpStatus.OK,
        statusText: 'OK',
        headers: {},
      };

      const httpServiceMock = jest
        .spyOn(httpService, 'post')
        .mockReturnValueOnce(of(mockResponse));

      await sendMessageRepository.send(bodyInitialMessage);

      expect(httpServiceMock).toHaveBeenCalledWith(
        'https://twilio.com/v1/notifications',
        expect.objectContaining({
          channel: 'PICKING',
          customer: {
            cellphone: '56952158950',
            first_name: 'John',
          },
          event: 'WSP_PICKING_SUBSTITUTION_PREFERENCES_V1',
          key: '12345',
          key_complement: expect.any(String),
          payload: {
            call_option_button: 'callOptionButton',
            choose_for_me_option_button: 'chooseForMeOptionButton',
            customer_first_name: 'John',
            refund_option_button: 'refundOptionButton',
          },
        }),
        {
          headers: expect.any(String),
        },
      );
    });
    it('should throw error when error is any', async () => {
      const payload = new PayloadInitialMessage({
        customerFirstName: 'John',
        callOptionButton: 'callOptionButton',
        chooseForMeOptionButton: 'chooseForMeOptionButton',
        refundOptionButton: 'refundOptionButton',
      });
      const bodyInitialMessage = new BodyInitialMessage({
        shippingGroupId: '12345',
        firstName: 'John',
        cellphone: '56952158950',
        customerId: 'customerId',
        payload: payload,
      });

      const mockError = new Error('Request error');
      jest.spyOn(httpService, 'post').mockReturnValue(throwError(mockError));

      try {
        await sendMessageRepository.send(bodyInitialMessage);
      } catch (error) {
        expect(error).toBeInstanceOf(InfrastructureError);
        expect(error?.message).toBe('Request error');
      }
    });

    it('should throw error when error is InfrastructureError', async () => {
      const payload = new PayloadInitialMessage({
        customerFirstName: 'John',
        callOptionButton: 'callOptionButton',
        chooseForMeOptionButton: 'chooseForMeOptionButton',
        refundOptionButton: 'refundOptionButton',
      });
      const bodyInitialMessage = new BodyInitialMessage({
        shippingGroupId: '12345',
        firstName: 'John',
        cellphone: '56952158950',
        customerId: 'customerId',
        payload: payload,
      });

      const mockError = new InfrastructureError(
        'Request Infrastructure error',
        400,
      );
      jest.spyOn(httpService, 'post').mockReturnValue(throwError(mockError));

      try {
        await sendMessageRepository.send(bodyInitialMessage);
      } catch (error) {
        expect(error).toBeInstanceOf(InfrastructureError);
        expect(error?.message).toBe('Request Infrastructure error');
      }
    });
  });
  describe('BodyFinishedMessage', () => {
    it('should return a true value when invoking the send method when the correct message body is sent - BodyFinishedMessage', async () => {
      const payload = new PayloadFinishedMessage();
      const bodyFinishedMessage = new BodyFinishedMessage({
        shippingGroupId: '12345',
        firstName: 'John',
        cellphone: '56952158950',
        customerId: 'customerId',
        payload: payload,
      });

      const mockResponse: AxiosResponse = {
        config: undefined,
        data: {
          status: 200,
          error: null,
          data: {},
        },
        status: HttpStatus.OK,
        statusText: 'OK',
        headers: {},
      };

      const httpServiceMock = jest
        .spyOn(httpService, 'post')
        .mockReturnValueOnce(of(mockResponse));

      await sendMessageRepository.send(
        bodyFinishedMessage as BodyFinishedMessage,
      );

      expect(httpServiceMock).toHaveBeenCalledWith(
        'https://twilio.com/v1/notifications',
        expect.objectContaining({
          channel: 'PICKING',
          customer: {
            cellphone: '56952158950',
            first_name: 'John',
          },
          event: 'WSP_PICKING_SUBSTITUTION_FINISHED',
          key: '12345',
          key_complement: expect.any(String),
          payload: {},
        }),
        {
          headers: expect.any(String),
        },
      );
    });
  });
  describe('BodySubstitutionMessage', () => {
    it('should return a true value when invoking the send method when the correct message body is sent - BodySubstitutionMessage', async () => {
      const payload = new PayloadSubstitutionMessage();
      const bodySubstitutionMessage = new BodySubstitutionMessage({
        shippingGroupId: '12345',
        firstName: 'John',
        cellphone: '56952158950',
        customerId: 'customerId',
        payload: payload,
      });

      const mockResponse: AxiosResponse = {
        config: undefined,
        data: {
          status: 200,
          error: null,
          data: {},
        },
        status: HttpStatus.OK,
        statusText: 'OK',
        headers: {},
      };

      const httpServiceMock = jest
        .spyOn(httpService, 'post')
        .mockReturnValueOnce(of(mockResponse));

      await sendMessageRepository.send(bodySubstitutionMessage);

      expect(httpServiceMock).toHaveBeenCalledWith(
        'https://twilio.com/v1/notifications',
        expect.objectContaining({
          channel: 'PICKING',
          customer: {
            cellphone: '56952158950',
            first_name: 'John',
          },
          event: 'WSP_PICKING_SUBSTITUTION_PROSPECT_APPROVAL',
          key: '12345',
          key_complement: expect.any(String),
          payload: {},
        }),
        {
          headers: expect.any(String),
        },
      );
    });
  });
});
