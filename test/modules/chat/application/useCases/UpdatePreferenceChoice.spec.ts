import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

// Domain
import { ChatRepository } from '../../../../../src/modules/chat/domain/ChatRepository';
import {
  Chat,
  ChoiceAvailableType,
} from '../../../../../src/modules/chat/domain/Chat';
import { Cellphone } from '../../../../../src/modules/shared/domain/valueObject/Cellphone';
import { ShippingGroupId } from '../../../../../src/modules/shared/domain/valueObject/ShippingGroupId';
import { CustomerId } from '../../../../../src/modules/shared/domain/valueObject/CustomerId';
import { ApplicationError } from '../../../../../src/modules/shared/domain/exception';

// Application
import { UpdatePreferenceChoice } from '../../../../../src/modules/chat/application/useCases/UpdatePreferenceChoice';

// Infrastructure
import { UpdateChatByChoiceDto } from '../../../../../src/modules/chat/infrastructure/http/dto/updateChatByChoice.dto';

// Mocks
import { ChatRepositoryMock } from '../../../../__mocks__/ChatRepositoryMock';

describe('UpdateChoiceByPreference', () => {
  let updatePreferenceChoice: UpdatePreferenceChoice;
  let chatRepository: ChatRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePreferenceChoice,
        {
          provide: ChatRepository,
          useClass: ChatRepositoryMock,
        },
      ],
    }).compile();

    updatePreferenceChoice = module.get<UpdatePreferenceChoice>(
      UpdatePreferenceChoice,
    );
    chatRepository = module.get<ChatRepository>(ChatRepository);
  });

  it('should be defined', () => {
    expect(updatePreferenceChoice).toBeDefined();
    expect(chatRepository).toBeDefined();
  });

  it('should throw error when chat not exist', async () => {
    const shippingGroupId = 'not-exist';
    const updatedChoice = new UpdateChatByChoiceDto();
    updatedChoice.shippingGroupId = shippingGroupId;
    updatedChoice.choice = 'choice';

    jest.spyOn(chatRepository, 'getByShippingGroup').mockResolvedValue(null);

    await expect(
      updatePreferenceChoice.execute(updatedChoice),
    ).rejects.toThrowError(
      new ApplicationError(
        `[SG:${shippingGroupId}] This chat not exist`,
        HttpStatus.OK,
      ),
    );
  });

  it('should throw an error when the chat already has a response', async () => {
    const shippingGroupId = 'not-exist';
    const updatedChoice = new UpdateChatByChoiceDto();
    updatedChoice.shippingGroupId = shippingGroupId;
    updatedChoice.choice = 'choice';
    const chat = new Chat({
      shippingGroupId: new ShippingGroupId(shippingGroupId),
      customerPhone: new Cellphone('56952158950'),
      customerId: new CustomerId('customerId'),
      sendingDate: new Date().toISOString(),
      agreeExtraPaid: false,
      choice: ChoiceAvailableType.CHOICE_FOR_ME,
    });

    jest.spyOn(chatRepository, 'getByShippingGroup').mockResolvedValue(chat);

    await expect(
      updatePreferenceChoice.execute(updatedChoice),
    ).rejects.toThrowError(
      new ApplicationError(
        `[SG:${shippingGroupId}] This chat already has a response and cannot be updated`,
        HttpStatus.OK,
      ),
    );
  });

  it('should throw an error when the chat already has a response', async () => {
    const shippingGroupId = 'not-exist';
    const updatedChoice = new UpdateChatByChoiceDto();
    updatedChoice.shippingGroupId = shippingGroupId;
    updatedChoice.choice = 'choice';
    const chat = new Chat({
      shippingGroupId: new ShippingGroupId(shippingGroupId),
      customerPhone: new Cellphone('56952158950'),
      customerId: new CustomerId('customerId'),
      sendingDate: new Date().toISOString(),
      agreeExtraPaid: false,
      choice: ChoiceAvailableType.CHOICE_FOR_ME,
    });

    jest.spyOn(chatRepository, 'getByShippingGroup').mockResolvedValue(chat);

    await expect(
      updatePreferenceChoice.execute(updatedChoice),
    ).rejects.toThrowError(
      new ApplicationError(
        `[SG:${shippingGroupId}] This chat already has a response and cannot be updated`,
        HttpStatus.OK,
      ),
    );
  });

  it('should correctly update the conversation with the new response', async () => {
    const shippingGroupId = 'exist';
    const updatedChoice = new UpdateChatByChoiceDto();
    updatedChoice.shippingGroupId = shippingGroupId;
    updatedChoice.choice = 'CHOICE_FOR_ME';
    const chat = new Chat({
      shippingGroupId: new ShippingGroupId(shippingGroupId),
      customerPhone: new Cellphone('56952158950'),
      customerId: new CustomerId('customerId'),
      sendingDate: new Date().toISOString(),
      agreeExtraPaid: false,
      choice: ChoiceAvailableType.UNANSWERED,
    });
    const updatedChat = new Chat({
      id: chat.id,
      shippingGroupId: new ShippingGroupId(shippingGroupId),
      customerPhone: new Cellphone('56952158950'),
      customerId: new CustomerId('customerId'),
      sendingDate: chat.sendingDate,
      agreeExtraPaid: false,
      choice: ChoiceAvailableType.CHOICE_FOR_ME,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    });

    jest.spyOn(chatRepository, 'getByShippingGroup').mockResolvedValue(chat);
    const spyChatRepositoryUpdated = jest
      .spyOn(chatRepository, 'update')
      .mockImplementation(() => Promise.resolve());

    await updatePreferenceChoice.execute(updatedChoice);

    expect(spyChatRepositoryUpdated).toHaveBeenCalledWith(updatedChat);
  });

  it('should correctly update the conversation with the new response but not update', async () => {
    const shippingGroupId = 'exist';
    const updatedChoice = new UpdateChatByChoiceDto();
    updatedChoice.shippingGroupId = shippingGroupId;
    updatedChoice.choice = 'not-valid';
    const chat = new Chat({
      shippingGroupId: new ShippingGroupId(shippingGroupId),
      customerPhone: new Cellphone('56952158950'),
      customerId: new CustomerId('customerId'),
      sendingDate: new Date().toISOString(),
      agreeExtraPaid: false,
      choice: ChoiceAvailableType.UNANSWERED,
    });
    const updatedChat = new Chat({
      id: chat.id,
      shippingGroupId: new ShippingGroupId(shippingGroupId),
      customerPhone: new Cellphone('56952158950'),
      customerId: new CustomerId('customerId'),
      sendingDate: chat.sendingDate,
      agreeExtraPaid: false,
      choice: ChoiceAvailableType.UNANSWERED,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    });

    jest.spyOn(chatRepository, 'getByShippingGroup').mockResolvedValue(chat);
    const spyChatRepositoryUpdated = jest
      .spyOn(chatRepository, 'update')
      .mockImplementation(() => Promise.resolve());

    await updatePreferenceChoice.execute(updatedChoice);

    expect(spyChatRepositoryUpdated).toHaveBeenCalledWith(updatedChat);
  });
});
