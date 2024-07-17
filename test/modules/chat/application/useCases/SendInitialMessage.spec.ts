import { Test } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

// Domain
import { SendMessageRepository } from '../../../../../src/modules/chat/domain/SendMessageRepository';
import {
  ApplicationError,
  InfrastructureError,
  InvalidArgumentError,
} from '../../../../../src/modules/shared/domain/exception';
import { ChatRepository } from '../../../../../src/modules/chat/domain/ChatRepository';
import { Chat } from '../../../../../src/modules/chat/domain/Chat';
import { ShippingGroupId } from '../../../../../src/modules/shared/domain/valueObject/ShippingGroupId';
import {
  EVENT_BUS,
  EventBus,
} from '../../../../../src/modules/shared/domain/EventBus';

// Application
import { SendInitialMessage } from '../../../../../src/modules/chat/application/useCases/SendInitialMessage';

// Infrastructure
import { SendFinishedMessageDto } from '../../../../../src/modules/chat/infrastructure/http/dto/sendFinishedMessageDto';
import { ResponseSendMessageDto } from '../../../../../src/modules/chat/infrastructure/http/dto/responseSendMessage.dto';

// Config
import { ConfigEnvService } from '../../../../../src/modules/config/ConfigEnvService';
import config from '../../../../../src/assets/default.json';

// Mocks
import { ChatRepositoryMock } from '../../../../__mocks__/ChatRepositoryMock';

describe('SendInitialMessage', () => {
  let sendInitialMessage: SendInitialMessage;
  let sendMessageRepository: SendMessageRepository;
  let chatRepository: ChatRepository;
  let eventBus: EventBus;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        SendInitialMessage,
        {
          provide: SendMessageRepository,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: ChatRepository,
          useClass: ChatRepositoryMock,
        },
        {
          provide: EVENT_BUS,
          useFactory: () => ({
            publish: jest.fn(),
          }),
        },
        {
          provide: ConfigEnvService,
          useFactory: () => ({
            getConfig: jest.fn(() => config),
            setConfig: jest.fn(),
          }),
        },
      ],
    }).compile();

    sendInitialMessage = moduleRef.get<SendInitialMessage>(SendInitialMessage);
    chatRepository = moduleRef.get<ChatRepository>(ChatRepository);
    eventBus = moduleRef.get<EventBus>(EVENT_BUS);
    sendMessageRepository = moduleRef.get<SendMessageRepository>(
      SendMessageRepository,
    );
  });

  it('should be defined', () => {
    expect(sendInitialMessage).toBeDefined();
  });

  it('should send message', async () => {
    const dto: SendFinishedMessageDto = {
      shippingGroupId: '1234',
      firstName: 'John',
      cellphone: '56952158950',
      customerId: 'customerId',
    };
    const result: ResponseSendMessageDto = ResponseSendMessageDto.OK();
    jest.spyOn(sendMessageRepository, 'send').mockResolvedValue(undefined);
    jest.spyOn(chatRepository, 'getByShippingGroup').mockResolvedValue(null);
    const spyEventBus = jest.spyOn(eventBus, 'publish').mockResolvedValue(null);
    const spyChatRepository = jest
      .spyOn(chatRepository, 'save')
      .mockResolvedValue(null);

    const response = await sendInitialMessage.execute(dto);

    expect(response).toEqual(result);
    expect(spyEventBus).toHaveBeenCalledWith([
      {
        aggregateId: expect.any(String),
        customerId: 'customerId',
        eventId: expect.any(String),
        eventName: 'chat.created',
        occurredOn: expect.any(Date),
        sendingDate: expect.any(String),
        shippingGroupId: '1234',
      },
    ]);
    expect(spyChatRepository).toHaveBeenCalledWith({
      agreeExtraPaid: expect.any(Boolean),
      choice: 'UNANSWERED',
      customerPhone: {
        value: '56952158950',
      },
      sendingDate: {
        value: expect.any(String),
      },
      id: expect.any(String),
      shippingGroupId: {
        value: '1234',
      },
      customerId: { value: 'customerId' },
      domainEvents: expect.arrayContaining([]),
      updatedAt: undefined,
      createdAt: undefined,
    });
    expect(sendMessageRepository.send).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: 'PICKING',
        event: 'WSP_PICKING_SUBSTITUTION_PREFERENCES_V1',
        shippingGroupId: {
          value: '1234',
        },
        sendingDate: {
          value: expect.any(String),
        },
        customer: expect.objectContaining({
          cellphone: {
            value: '56952158950',
          },
          firstName: {
            value: 'John',
          },
          customerId: {
            value: 'customerId',
          },
        }),
        payload: expect.objectContaining({
          callOptionButton: {
            value: 'callOptionButton',
          },
          chooseForMeOptionButton: { value: 'chooseForMeOptionButton' },
          customerFirstName: {
            value: 'John',
          },
          refundOptionButton: {
            value: 'refundOptionButton',
          },
        }),
      }),
    );
  });

  it('should return a error when a message has already been sent', async () => {
    const dto: SendFinishedMessageDto = {
      shippingGroupId: '1234',
      firstName: 'John',
      cellphone: '56952158950',
      customerId: 'customerId',
    };
    const chat = new Chat({
      shippingGroupId: new ShippingGroupId('1234'),
    });
    const sypChatRepository = jest
      .spyOn(chatRepository, 'getByShippingGroup')
      .mockResolvedValue(chat);
    const spySendMessage = jest
      .spyOn(sendMessageRepository, 'send')
      .mockResolvedValue(undefined);

    await expect(sendInitialMessage.execute(dto)).rejects.toThrowError(
      new ApplicationError(
        '[SG:1234] The initial message has already been sent to the client previously',
        HttpStatus.OK,
      ),
    );

    expect(sypChatRepository).toHaveBeenCalledWith('1234');
    expect(spySendMessage).not.toHaveBeenCalled();
  });

  it('should return an error if there is a problem with the database', async () => {
    const dto: SendFinishedMessageDto = {
      shippingGroupId: '1234',
      firstName: 'John',
      cellphone: '56952158950',
      customerId: 'customerId',
    };
    jest.spyOn(chatRepository, 'getByShippingGroup').mockResolvedValue(null);
    jest
      .spyOn(chatRepository, 'getByShippingGroup')
      .mockRejectedValue(
        new InfrastructureError('Error BD', HttpStatus.INTERNAL_SERVER_ERROR),
      );

    await expect(sendInitialMessage.execute(dto)).rejects.toThrowError(
      new InfrastructureError('Error BD', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });

  it('should return an error when something unexpected happens', async () => {
    const dto: SendFinishedMessageDto = {
      shippingGroupId: '1234',
      firstName: 'John',
      cellphone: '56952158950',
      customerId: 'customerId',
    };
    jest.spyOn(chatRepository, 'getByShippingGroup').mockResolvedValue(null);
    jest
      .spyOn(chatRepository, 'getByShippingGroup')
      .mockRejectedValue(new Error('Error Random'));

    await expect(sendInitialMessage.execute(dto)).rejects.toThrowError(
      new ApplicationError(
        `[SG:${dto.shippingGroupId}] Error trying to send initial message to customer`,
        HttpStatus.CONFLICT,
      ),
    );
  });

  it('should throw an error if an exception occurs when firstName is empty', async () => {
    const dto: SendFinishedMessageDto = {
      shippingGroupId: '1234',
      firstName: '',
      cellphone: '56952158950',
      customerId: 'customerId',
    };

    await expect(sendInitialMessage.execute(dto)).rejects.toThrowError(
      new InvalidArgumentError('<FirstName> does not allow the value empty'),
    );
  });

  it('should throw an error if an exception occurs when cellphone is empty', async () => {
    const dto: SendFinishedMessageDto = {
      shippingGroupId: '1234',
      firstName: 'John',
      cellphone: '',
      customerId: 'customerId',
    };

    await expect(sendInitialMessage.execute(dto)).rejects.toThrowError(
      new InvalidArgumentError('<Cellphone> does not allow the value empty'),
    );
  });
});
