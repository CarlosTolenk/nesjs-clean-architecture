import { Test, TestingModule } from '@nestjs/testing';

// Domain
import { ChatRepository } from '../../../../../src/modules/chat/domain/ChatRepository';
import { ProspectRepository } from '../../../../../src/modules/chat/domain/ProspectRepository';
import { SubstitutionRepository } from '../../../../../src/modules/chat/domain/SubstitutionRepository';
import { Prospect } from '../../../../../src/modules/chat/domain/Prospect';
import {
  Chat,
  ChoiceAvailableType,
} from '../../../../../src/modules/chat/domain/Chat';
import { Substitution } from '../../../../../src/modules/chat/domain/Substitution';
import { ShippingGroupId } from '../../../../../src/modules/shared/domain/valueObject/ShippingGroupId';
import { CustomerId } from '../../../../../src/modules/shared/domain/valueObject/CustomerId';
import { Cellphone } from '../../../../../src/modules/shared/domain/valueObject/Cellphone';
import { SendingDate } from '../../../../../src/modules/shared/domain/valueObject/SendingDate';

// Application
import { GetChatWithSubstitutions } from '../../../../../src/modules/chat/application/useCases/GetChatWithSubstitutions';

// Mocks
import { ChatRepositoryMock } from '../../../../__mocks__/ChatRepositoryMock';
import { SubstitutionRepositoryMock } from '../../../../__mocks__/SubstitutionRepositoryMock';
import { ProspectRepositoryMock } from '../../../../__mocks__/ProspectRepositoryMock';

describe('GetChatWithSubstitutions', () => {
  let getChatWithSubstitutions: GetChatWithSubstitutions;
  let chatRepository: ChatRepository;
  let prospectRepository: ProspectRepository;
  let substitutionRepository: SubstitutionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetChatWithSubstitutions,
        {
          provide: ChatRepository,
          useClass: ChatRepositoryMock,
        },
        {
          provide: SubstitutionRepository,
          useClass: SubstitutionRepositoryMock,
        },
        {
          provide: ProspectRepository,
          useClass: ProspectRepositoryMock,
        },
      ],
    }).compile();

    getChatWithSubstitutions = module.get<GetChatWithSubstitutions>(
      GetChatWithSubstitutions,
    );
    chatRepository = module.get<ChatRepository>(ChatRepository);
    prospectRepository = module.get<ProspectRepository>(ProspectRepository);
    substitutionRepository = module.get<SubstitutionRepository>(
      SubstitutionRepository,
    );
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

    const substitution = new Substitution({
      id: 'substitutionId',
      messageId: 'messageId',
      agree: 'agree',
      chatId: chatId,
      skuOriginal: 'skuOriginal',
      descriptionOriginal: 'descriptionOriginal',
    });

    const prospect = new Prospect({
      id: 'prospectId',
    });

    jest.spyOn(chatRepository, 'getByShippingGroup').mockResolvedValue(chat);
    jest
      .spyOn(substitutionRepository, 'getAllByChatId')
      .mockResolvedValue([substitution]);
    jest
      .spyOn(prospectRepository, 'getAllBySubstitutionId')
      .mockResolvedValue([prospect]);

    const result = await getChatWithSubstitutions.execute({
      shippingGroupId,
    });

    expect(chatRepository.getByShippingGroup).toHaveBeenCalledWith(
      shippingGroupId,
    );
    expect(substitutionRepository.getAllByChatId).toHaveBeenCalledWith(chatId);
    expect(prospectRepository.getAllBySubstitutionId).toHaveBeenCalledWith(
      substitution.id,
    );

    expect(result).toEqual({
      chat: {
        id: chatId,
        shippingGroupId: 'shippingGroupId',
        choice: 'UNANSWERED',
        sendingDate: expect.any(String),
        agreeExtraPaid: false,
        customerPhone: '56952158950',
        customerId: 'customerId',
      },
      substitution: {
        [substitution.skuOriginal]: {
          id: substitution.id,
          messageId: 'messageId',
          agree: 'agree',
          chatId: chatId,
          skuOriginal: 'skuOriginal',
          descriptionOriginal: 'descriptionOriginal',
          prospect: [prospect],
        },
      },
    });
  });

  it('should return chat without substitution if there are no substitutions', async () => {
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
    jest.spyOn(substitutionRepository, 'getAllByChatId').mockResolvedValue([]);

    const result = await getChatWithSubstitutions.execute({
      shippingGroupId,
    });

    expect(chatRepository.getByShippingGroup).toHaveBeenCalledWith(
      shippingGroupId,
    );
    expect(substitutionRepository.getAllByChatId).toHaveBeenCalledWith(chatId);

    expect(result).toEqual({
      chat: {
        id: chatId,
        shippingGroupId: 'shippingGroupId',
        choice: 'UNANSWERED',
        sendingDate: expect.any(String),
        agreeExtraPaid: false,
        customerPhone: '56952158950',
        customerId: 'customerId',
      },
      substitution: null,
    });
  });

  it('should throw an error if an exception occurs', async () => {
    const shippingGroupId = 'shippingGroupId';
    jest
      .spyOn(chatRepository, 'getByShippingGroup')
      .mockRejectedValue(new Error());

    await expect(
      getChatWithSubstitutions.execute({ shippingGroupId }),
    ).rejects.toThrow(Error);
  });
});
