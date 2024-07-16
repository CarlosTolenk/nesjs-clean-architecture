import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';

// Domain
import { Substitution } from '../../../../../src/modules/chat/domain/Substitution';
import { InfrastructureError } from '../../../../../src/modules/shared/domain/exception';

// Infrastructure
import { SubstitutionEntity } from '../../../../../src/modules/chat/infrastructure/persistence/entities/Substitution.entity';
import { SubstitutionRepositoryAzure } from '../../../../../src/modules/chat/infrastructure/persistence/SubstitutionRepositoryAzure';

describe('SubstitutionRepositoryAzure', () => {
  let repository: SubstitutionRepositoryAzure;
  let substitutionRepository: Repository<SubstitutionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubstitutionRepositoryAzure,
        {
          provide: getRepositoryToken(SubstitutionEntity),
          useClass: Repository, // Use the real Repository class
        },
      ],
    }).compile();

    repository = module.get<SubstitutionRepositoryAzure>(
      SubstitutionRepositoryAzure,
    );
    substitutionRepository = module.get<Repository<SubstitutionEntity>>(
      getRepositoryToken(SubstitutionEntity),
    );
  });

  describe('getAllByChatId', () => {
    it('should return all substitutions for a given chatId', async () => {
      const chatId = '123';
      const substitutionEntity1 = new SubstitutionEntity();
      substitutionEntity1.id = '1';
      substitutionEntity1.chatId = chatId;
      substitutionEntity1.descriptionOriginal = 'Substitution 1';
      substitutionEntity1.skuOriginal = 'Sku 1';
      substitutionEntity1.agree = 'NO';
      substitutionEntity1.messageId = 'messageId1';

      const substitutionEntity2 = new SubstitutionEntity();
      substitutionEntity2.id = '2';
      substitutionEntity2.chatId = chatId;
      substitutionEntity2.descriptionOriginal = 'Substitution 2';
      substitutionEntity2.skuOriginal = 'Sku 2';
      substitutionEntity2.agree = 'NO';
      substitutionEntity2.messageId = 'messageId2';
      jest
        .spyOn(substitutionRepository, 'find')
        .mockResolvedValue([substitutionEntity1, substitutionEntity2]);

      const result = await repository.getAllByChatId(chatId);

      expect(result).toEqual([
        new Substitution({
          id: '1',
          chatId,
          descriptionOriginal: 'Substitution 1',
          skuOriginal: 'Sku 1',
          agree: 'NO',
          messageId: 'messageId1',
        }),
        new Substitution({
          id: '2',
          chatId,
          descriptionOriginal: 'Substitution 2',
          skuOriginal: 'Sku 2',
          agree: 'NO',
          messageId: 'messageId2',
        }),
      ]);
    });

    it('should throw an exception when the substitution does not exist', async () => {
      const shippingGroupId = '123';
      jest.spyOn(substitutionRepository, 'find').mockResolvedValue(undefined);

      await expect(
        repository.getAllByChatId(shippingGroupId),
      ).rejects.toThrowError(
        new InfrastructureError('Not substitution', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception when the substitution does not exist', async () => {
      const shippingGroupId = '123';
      jest
        .spyOn(substitutionRepository, 'find')
        .mockRejectedValue(
          new InfrastructureError('Not substitution', HttpStatus.NOT_FOUND),
        );

      await expect(
        repository.getAllByChatId(shippingGroupId),
      ).rejects.toThrowError(
        new InfrastructureError('Not substitution', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception when unexpected error', async () => {
      const shippingGroupId = '123';
      jest
        .spyOn(substitutionRepository, 'find')
        .mockRejectedValue(new Error('error'));

      await expect(
        repository.getAllByChatId(shippingGroupId),
      ).rejects.toThrowError(
        new InfrastructureError(
          '[ChatId:123] Could not get information from the database',
          HttpStatus.SERVICE_UNAVAILABLE,
        ),
      );
    });
  });
});
