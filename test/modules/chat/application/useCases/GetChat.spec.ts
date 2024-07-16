import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

// Domain
import { ChatRepository } from '../../../../../src/modules/chat/domain/ChatRepository';
import {
  Chat,
  ChoiceAvailableType,
} from '../../../../../src/modules/chat/domain/Chat';
import { ShippingGroupId } from '../../../../../src/modules/shared/domain/valueObject/ShippingGroupId';
import { Cellphone } from '../../../../../src/modules/shared/domain/valueObject/Cellphone';
import { CustomerId } from '../../../../../src/modules/shared/domain/valueObject/CustomerId';
import { InfrastructureError } from '../../../../../src/modules/shared/domain/exception';

// Application
import { GetChat } from '../../../../../src/modules/chat/application/useCases/GetChat';

// Mocks
import { ChatRepositoryMock } from '../../../../__mocks__/ChatRepositoryMock';
import { SendingDate } from '../../../../../src/modules/shared/domain/valueObject/SendingDate';

describe('GetChat', () => {
  let getChat: GetChat;
  let chatRepository: ChatRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetChat,
        {
          provide: ChatRepository,
          useClass: ChatRepositoryMock,
        },
      ],
    }).compile();

    getChat = module.get<GetChat>(GetChat);
    chatRepository = module.get<ChatRepository>(ChatRepository);
  });

  it('should return chat with substitution if there are substitutions', async () => {
    const chatId = 'chatId';
    const shippingGroupId = 'shippingGroupId';

    const chat = new Chat({
      id: chatId,
      shippingGroupId: new ShippingGroupId('shippingGroupId'),
      choice: ChoiceAvailableType.UNANSWERED,
      sendingDate: new SendingDate(),
      agreeExtraPaid: false,
      customerPhone: new Cellphone('56952158950'),
      customerId: new CustomerId('customerId'),
    });

    jest.spyOn(chatRepository, 'getByShippingGroup').mockResolvedValue(chat);

    const result = await getChat.execute({
      shippingGroupId,
    });

    expect(chatRepository.getByShippingGroup).toHaveBeenCalledWith(
      shippingGroupId,
    );

    expect(result).toEqual({
      id: chatId,
      shippingGroupId: 'shippingGroupId',
      choice: 'UNANSWERED',
      sendingDate: expect.any(String),
      agreeExtraPaid: false,
      customerPhone: '56952158950',
      customerId: 'customerId',
    });
  });

  it('should throw an error if an exception occurs', async () => {
    const shippingGroupId = 'shippingGroupId';
    const spyRepository = jest
      .spyOn(chatRepository, 'getByShippingGroup')
      .mockRejectedValue(
        new InfrastructureError('Not chat', HttpStatus.NOT_FOUND),
      );

    await expect(getChat.execute({ shippingGroupId })).rejects.toThrowError(
      new InfrastructureError('Not chat', HttpStatus.NOT_FOUND),
    );

    expect(spyRepository).toHaveBeenCalledWith(shippingGroupId);
  });
});
