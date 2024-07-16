import { Test, TestingModule } from '@nestjs/testing';

// Domain
import { ILogger } from '../../../../../src/modules/shared/domain/Logger';
import { InfrastructureError } from '../../../../../src/modules/shared/domain/exception';

// Application
import { GetChat } from '../../../../../src/modules/chat/application/useCases/GetChat';
import { GetChatWithSubstitutions } from '../../../../../src/modules/chat/application/useCases/GetChatWithSubstitutions';
import { SendInitialMessage } from '../../../../../src/modules/chat/application/useCases/SendInitialMessage';
import { SendSubstitutionMessage } from '../../../../../src/modules/chat/application/useCases/SendSubstitutionMessage';
import { SendFinishedMessage } from '../../../../../src/modules/chat/application/useCases/SendFinishedMessage';

// Infrastructure
import { SearchShippingGroupIdDto } from '../../../../../src/modules/chat/infrastructure/http/dto/searchShippingGroupId.dto';
import { ChatController } from '../../../../../src/modules/chat/infrastructure/http/chat.controller';
import { SendInitialMessageDto } from '../../../../../src/modules/chat/infrastructure/http/dto/sendInitialMessage.dto';
import { SendSubstitutionMessageDto } from '../../../../../src/modules/chat/infrastructure/http/dto/sendSubstitutionMessage.dto';
import { SendFinishedMessageDto } from '../../../../../src/modules/chat/infrastructure/http/dto/sendFinishedMessageDto';
import { LoggerWinston } from '../../../../../src/modules/shared/infrastructure/logger/loggerWinston';
import { ResponseChatWithSubstitutionDto } from '../../../../../src/modules/chat/infrastructure/http/dto/responseChatWithSubstitutionDto';
import { ResponseChatDetailDto } from '../../../../../src/modules/chat/infrastructure/http/dto/responseChatDetailDto';

describe('ChatController', () => {
  let controller: ChatController;
  let useCaseGetChatWithSubstitutions: GetChatWithSubstitutions;
  let useCaseGetChat: GetChat;
  let useCaseSendInitial: SendInitialMessage;
  let useCaseSendSubstitution: SendSubstitutionMessage;
  let useCaseSendFinished: SendFinishedMessage;
  let logger: ILogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        { provide: GetChatWithSubstitutions, useValue: { execute: jest.fn() } },
        { provide: GetChat, useValue: { execute: jest.fn() } },
        { provide: ILogger, useClass: LoggerWinston },
        { provide: SendInitialMessage, useValue: { execute: jest.fn() } },
        { provide: SendSubstitutionMessage, useValue: { execute: jest.fn() } },
        { provide: SendFinishedMessage, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    useCaseGetChatWithSubstitutions = module.get<GetChatWithSubstitutions>(
      GetChatWithSubstitutions,
    );
    useCaseGetChat = module.get<GetChat>(GetChat);
    useCaseSendInitial = module.get<SendInitialMessage>(SendInitialMessage);
    useCaseSendSubstitution = module.get<SendSubstitutionMessage>(
      SendSubstitutionMessage,
    );
    useCaseSendFinished = module.get<SendFinishedMessage>(SendFinishedMessage);
    logger = module.get<ILogger>(ILogger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(useCaseGetChatWithSubstitutions).toBeDefined();
    expect(useCaseGetChat).toBeDefined();
    expect(useCaseSendInitial).toBeDefined();
    expect(useCaseSendSubstitution).toBeDefined();
    expect(useCaseSendFinished).toBeDefined();
    expect(logger).toBeDefined();
  });

  describe('getWithSubstitutionByShippingGroupId', () => {
    it('should return chat data correctly', async () => {
      const params = new SearchShippingGroupIdDto();
      const expectedResult = new ResponseChatWithSubstitutionDto();
      expectedResult.chat = {
        id: '',
        shippingGroupId: '',
        choice: '',
        customerPhone: '',
        customerId: '',
        sendingDate: '',
        agreeExtraPaid: false,
      };
      expectedResult.substitution = {
        '12245': {
          id: '',
          messageId: '',
          agree: '',
          descriptionOriginal: '',
          skuOriginal: '',
          chatId: '',
          prospect: [],
        },
      };

      (
        useCaseGetChatWithSubstitutions.execute as jest.Mock
      ).mockResolvedValueOnce(expectedResult);

      const result =
        await controller.getWithSubstitutionByShippingGroupId(params);

      expect(result).toBe(expectedResult);
      expect(useCaseGetChatWithSubstitutions.execute).toHaveBeenCalledWith(
        params,
      );
    });

    it('should handle error correctly', async () => {
      const params = new SearchShippingGroupIdDto();
      const error = new InfrastructureError('Test error', 400);
      const spyLogger = jest.spyOn(logger, 'error');

      (
        useCaseGetChatWithSubstitutions.execute as jest.Mock
      ).mockRejectedValueOnce(error);

      try {
        await controller.getWithSubstitutionByShippingGroupId(params);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toEqual(error);
        expect(useCaseGetChatWithSubstitutions.execute).toHaveBeenCalledWith(
          params,
        );
        expect(spyLogger).toHaveBeenCalledWith(
          'Error to hit getWithSubstitutionByShippingGroupId',
          { ...error },
        );
      }
    });
  });

  describe('getByShippingGroupId', () => {
    it('should return chat data correctly', async () => {
      const params = new SearchShippingGroupIdDto();
      const expectedResult = new ResponseChatDetailDto();
      expectedResult.id = 'id';
      expectedResult.shippingGroupId = 'shippingGroupId';
      expectedResult.choice = 'choice';
      expectedResult.customerPhone = 'customerPhone';
      expectedResult.customerId = 'customerId';
      expectedResult.sendingDate = 'date';
      expectedResult.agreeExtraPaid = false;

      (useCaseGetChat.execute as jest.Mock).mockResolvedValueOnce(
        expectedResult,
      );

      const result = await controller.getByShippingGroupId(params);

      expect(result).toBe(expectedResult);
      expect(useCaseGetChat.execute).toHaveBeenCalledWith(params);
    });

    it('should handle error correctly', async () => {
      const params = new SearchShippingGroupIdDto();
      const error = new InfrastructureError('Test error', 400);
      const spyLogger = jest.spyOn(logger, 'error');

      (useCaseGetChat.execute as jest.Mock).mockRejectedValueOnce(error);

      try {
        await controller.getByShippingGroupId(params);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toEqual(error);
        expect(useCaseGetChat.execute).toHaveBeenCalledWith(params);
        expect(spyLogger).toHaveBeenCalledWith(
          'Error to hit getByShippingGroupId',
          { ...error },
        );
      }
    });
  });

  describe('postInitialMessage', () => {
    it('should handle error correctly', async () => {
      const params = new SendInitialMessageDto();
      const error = new InfrastructureError('Test error', 400);
      const spyLogger = jest.spyOn(logger, 'error');

      (useCaseSendInitial.execute as jest.Mock).mockRejectedValueOnce(error);

      try {
        await controller.postInitialMessage(params);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toEqual(error);
        expect(useCaseSendInitial.execute).toHaveBeenCalledWith(params);
        expect(spyLogger).toHaveBeenCalledWith(
          'Error to hit postInitialMessage',
          { ...error },
        );
      }
    });
  });

  describe('postSubstitutionMessage', () => {
    it('should handle error correctly', async () => {
      const params = new SendSubstitutionMessageDto();
      const error = new InfrastructureError('Test error', 400);
      const spyLogger = jest.spyOn(logger, 'error');

      (useCaseSendSubstitution.execute as jest.Mock).mockRejectedValueOnce(
        error,
      );

      try {
        await controller.postSubstitutionMessage(params);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toEqual(error);
        expect(useCaseSendSubstitution.execute).toHaveBeenCalledWith(params);
        expect(spyLogger).toHaveBeenCalledWith(
          'Error to hit postSubstitutionMessage',
          { ...error },
        );
      }
    });
  });
  describe('postFinishedMessage', () => {
    it('should handle error correctly', async () => {
      const params = new SendFinishedMessageDto();
      const error = new InfrastructureError('Test error', 400);
      const spyLogger = jest.spyOn(logger, 'error');

      (useCaseSendFinished.execute as jest.Mock).mockRejectedValueOnce(error);

      try {
        await controller.postFinishedMessage(params);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toEqual(error);
        expect(useCaseSendFinished.execute).toHaveBeenCalledWith(params);
        expect(spyLogger).toHaveBeenCalledWith(
          'Error to hit postFinishedMessage',
          { ...error },
        );
      }
    });
  });
});
