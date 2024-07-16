import { Test } from '@nestjs/testing';

// Domain
import { SendMessageRepository } from '../../../../../src/modules/chat/domain/SendMessageRepository';
import { InvalidArgumentError } from '../../../../../src/modules/shared/domain/exception';

// Application
import { SendSubstitutionMessage } from '../../../../../src/modules/chat/application/useCases/SendSubstitutionMessage';

// Infrastructure
import { SendFinishedMessageDto } from '../../../../../src/modules/chat/infrastructure/http/dto/sendFinishedMessageDto';
import { ResponseSendMessageDto } from '../../../../../src/modules/chat/infrastructure/http/dto/responseSendMessage.dto';

describe('SendSubstitutionMessage', () => {
  let sendSubstitutionMessage: SendSubstitutionMessage;
  let sendMessageRepository: SendMessageRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SendSubstitutionMessage,
        {
          provide: SendMessageRepository,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    sendSubstitutionMessage = moduleRef.get<SendSubstitutionMessage>(
      SendSubstitutionMessage,
    );
    sendMessageRepository = moduleRef.get<SendMessageRepository>(
      SendMessageRepository,
    );
  });

  it('should be defined', () => {
    expect(sendSubstitutionMessage).toBeDefined();
  });

  it('should send an audit message', async () => {
    const dto: SendFinishedMessageDto = {
      shippingGroupId: '1234',
      firstName: 'John',
      cellphone: '56952158950',
      customerId: 'customerId',
    };
    const result: ResponseSendMessageDto = ResponseSendMessageDto.OK();

    jest.spyOn(sendMessageRepository, 'send').mockResolvedValue(undefined);

    const response = await sendSubstitutionMessage.execute(dto);

    expect(response).toEqual(result);
    expect(sendMessageRepository.send).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: 'PICKING',
        event: 'WSP_PICKING_SUBSTITUTION_PROSPECT_APPROVAL',
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
        payload: expect.objectContaining({}),
      }),
    );
  });

  it('should throw an error if an exception occurs when firstName is empty', async () => {
    const dto: SendFinishedMessageDto = {
      shippingGroupId: '1234',
      firstName: '',
      cellphone: '56952158950',
      customerId: 'customerId',
    };
    await expect(sendSubstitutionMessage.execute(dto)).rejects.toThrowError(
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

    await expect(sendSubstitutionMessage.execute(dto)).rejects.toThrowError(
      new InvalidArgumentError('<Cellphone> does not allow the value empty'),
    );
  });
});
