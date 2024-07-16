import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';

// Domain
import {
  Chat,
  ChoiceAvailableType,
} from '../../../../../src/modules/chat/domain/Chat';
import { InfrastructureError } from '../../../../../src/modules/shared/domain/exception';
import { ShippingGroupId } from '../../../../../src/modules/shared/domain/valueObject/ShippingGroupId';
import { Cellphone } from '../../../../../src/modules/shared/domain/valueObject/Cellphone';
import { CustomerId } from '../../../../../src/modules/shared/domain/valueObject/CustomerId';
import { DomainError } from '../../../../../src/modules/shared/domain/exception/DomainError';
import { SendingDate } from '../../../../../src/modules/shared/domain/valueObject/SendingDate';

// Infrastructure
import { ChatRepositoryAzure } from '../../../../../src/modules/chat/infrastructure/persistence/ChatRepositoryAzure';
import { ChatEntity } from '../../../../../src/modules/chat/infrastructure/persistence/entities/Chat.entity';

describe('ChatRepositoryAzure', () => {
  let chatRepositoryAzure: ChatRepositoryAzure;
  let chatRepository: Repository<ChatEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ChatRepositoryAzure,
        {
          provide: getRepositoryToken(ChatEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    chatRepositoryAzure =
      moduleRef.get<ChatRepositoryAzure>(ChatRepositoryAzure);
    chatRepository = moduleRef.get<Repository<ChatEntity>>(
      getRepositoryToken(ChatEntity),
    );
  });

  describe('save', () => {
    it('should save correctly', async () => {
      const shippingGroupId = 'shippingGroupId';
      const chat = new Chat({
        shippingGroupId: new ShippingGroupId(shippingGroupId),
        choice: ChoiceAvailableType.UNANSWERED,
        customerPhone: new Cellphone('56952158950'),
      });
      const chatEntity = new ChatEntity();
      chatEntity.shippingGroupId = shippingGroupId;
      jest.spyOn(chatRepository, 'save').mockResolvedValue(chatEntity);

      const result = await chatRepository.save(chatEntity);

      expect(result).toBeDefined();
    });

    it('should throw an exception when unexpected error', async () => {
      const chat = new Chat({
        shippingGroupId: new ShippingGroupId('shippingGroupId'),
        choice: ChoiceAvailableType.UNANSWERED,
        customerPhone: new Cellphone('56952158950'),
      });
      jest.spyOn(chatRepository, 'save').mockRejectedValue(new Error('error'));

      await expect(chatRepositoryAzure.save(chat)).rejects.toThrowError(
        new InfrastructureError(
          '[SG:shippingGroupId] Could not save information from the database',
          HttpStatus.SERVICE_UNAVAILABLE,
        ),
      );
    });
  });

  describe('update', () => {
    it('should update correctly', async () => {
      const shippingGroupId = 'shippingGroupId';
      const chat = new Chat({
        id: 'id',
        shippingGroupId: new ShippingGroupId(shippingGroupId),
        customerPhone: new Cellphone('56952158950'),
        customerId: new CustomerId('customerId'),
        sendingDate: new SendingDate(new Date().toISOString()),
        agreeExtraPaid: false,
        choice: ChoiceAvailableType.CHOICE_FOR_ME,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const chatUpdated = ChatEntity.fromDomain(chat);
      jest.spyOn(chatRepository, 'save').mockResolvedValue(chatUpdated);

      const result = await chatRepository.save(chatUpdated);

      expect(result).toBeDefined();
    });

    it('should throw an exception when unexpected error', async () => {
      const chat = new Chat({
        shippingGroupId: new ShippingGroupId('shippingGroupId'),
        choice: ChoiceAvailableType.UNANSWERED,
        customerPhone: new Cellphone('56952158950'),
      });
      jest.spyOn(chatRepository, 'save').mockRejectedValue(new Error('error'));

      await expect(chatRepositoryAzure.update(chat)).rejects.toThrowError(
        new InfrastructureError(
          '[SG:shippingGroupId] Could not update information from the database',
          HttpStatus.SERVICE_UNAVAILABLE,
        ),
      );
    });
  });

  describe('getByShippingGroup', () => {
    it('should return the chat when it exists', async () => {
      const shippingGroupId = '123';
      const chatEntity = ChatEntity.create({
        shippingGroupId: shippingGroupId,
        customerPhone: '56952158950',
        customerId: 'customerId',
        sendingDate: 'sendingDate',
        choice: 'UNANSWERED',
      });
      jest.spyOn(chatRepository, 'findOne').mockResolvedValue(chatEntity);

      const result =
        await chatRepositoryAzure.getByShippingGroup(shippingGroupId);

      expect(chatRepository.findOne).toHaveBeenCalledWith({
        where: { shippingGroupId },
      });
      expect(result).toBeInstanceOf(Chat);
      expect(result.shippingGroupId.value).toBe(shippingGroupId);
      expect(result.customerPhone.value).toBe('56952158950');
      expect(result.customerId.value).toBe('customerId');
      expect(result.choice).toBe('UNANSWERED');
    });

    it('should throw error when the chat when it exists but data is invalid', async () => {
      const shippingGroupId = '123';
      const chatEntity = ChatEntity.create({
        shippingGroupId: shippingGroupId,
        customerPhone: '56952158950-not-valid',
        customerId: 'customerId',
        sendingDate: 'sendingDate',
        choice: 'UNANSWERED',
      });
      jest.spyOn(chatRepository, 'findOne').mockResolvedValue(chatEntity);

      await expect(
        chatRepositoryAzure.getByShippingGroup(shippingGroupId),
      ).rejects.toThrowError(
        new DomainError(
          `[SG:${shippingGroupId}] - problem converting database data to domain model - The Cellphone <56952158950-not-valid> is not valid`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an exception when the chat does not exist', async () => {
      const shippingGroupId = '123';
      jest.spyOn(chatRepository, 'findOne').mockResolvedValue(undefined);

      const result =
        await chatRepositoryAzure.getByShippingGroup(shippingGroupId);

      expect(result).toEqual(null);
    });

    it('should throw an exception when unexpected error', async () => {
      const shippingGroupId = '123';
      jest
        .spyOn(chatRepository, 'findOne')
        .mockRejectedValue(new Error('error'));

      await expect(
        chatRepositoryAzure.getByShippingGroup(shippingGroupId),
      ).rejects.toThrowError(
        new InfrastructureError(
          '[SG:123] Could not get information from the database',
          HttpStatus.SERVICE_UNAVAILABLE,
        ),
      );
    });
  });
});
