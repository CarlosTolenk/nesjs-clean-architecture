import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

// Infrastructure
import { ProspectRepositoryAzure } from '../../../../../src/modules/chat/infrastructure/persistence/ProspectRepositoryAzure';
import { ProspectEntity } from '../../../../../src/modules/chat/infrastructure/persistence/entities/Prospect.entity';
import { InfrastructureError } from '../../../../../src/modules/shared/domain/exception';
import { HttpStatus } from '@nestjs/common';

describe('ProspectRepositoryAzure', () => {
  let prospectRepositoryAzure: ProspectRepositoryAzure;
  let prospectRepository: Repository<ProspectEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProspectRepositoryAzure,
        {
          provide: getRepositoryToken(ProspectEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    prospectRepositoryAzure = moduleRef.get<ProspectRepositoryAzure>(
      ProspectRepositoryAzure,
    );
    prospectRepository = moduleRef.get<Repository<ProspectEntity>>(
      getRepositoryToken(ProspectEntity),
    );
  });

  describe('getAllBySubstitutionId', () => {
    it('should return the prospects when they exist', async () => {
      const substitutionId = '123';
      const prospectEntities = [new ProspectEntity(), new ProspectEntity()];
      jest
        .spyOn(prospectRepository, 'find')
        .mockResolvedValue(prospectEntities);

      const result =
        await prospectRepositoryAzure.getAllBySubstitutionId(substitutionId);

      expect(prospectRepository.find).toHaveBeenCalledWith({
        where: { substitutionId },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: prospectEntities[0].id,
        description: prospectEntities[0].description,
        sku: prospectEntities[0].sku,
        extraPaid: prospectEntities[0].extraPaid,
        subsidy: prospectEntities[0].subsidy,
        substitutionId: prospectEntities[0].substitutionId,
      });
      expect(result[1]).toEqual({
        id: prospectEntities[1].id,
        description: prospectEntities[1].description,
        sku: prospectEntities[1].sku,
        extraPaid: prospectEntities[1].extraPaid,
        subsidy: prospectEntities[1].subsidy,
        substitutionId: prospectEntities[1].substitutionId,
      });
    });

    it('should return an empty array when no prospects exist', async () => {
      const substitutionId = '123';
      jest.spyOn(prospectRepository, 'find').mockResolvedValue([]);

      const result =
        await prospectRepositoryAzure.getAllBySubstitutionId(substitutionId);

      expect(prospectRepository.find).toHaveBeenCalledWith({
        where: { substitutionId },
      });
      expect(result).toHaveLength(0);
    });

    it('should throw an exception when the prospect does not exist', async () => {
      const substitutionId = '123';
      jest.spyOn(prospectRepository, 'find').mockResolvedValue(undefined);

      await expect(
        prospectRepositoryAzure.getAllBySubstitutionId(substitutionId),
      ).rejects.toThrowError(
        new InfrastructureError('Not prospect', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception when unexpected error', async () => {
      const substitutionId = '123';
      jest
        .spyOn(prospectRepository, 'find')
        .mockRejectedValue(new Error('error'));

      await expect(
        prospectRepositoryAzure.getAllBySubstitutionId(substitutionId),
      ).rejects.toThrowError(
        new InfrastructureError(
          '[SubstitutionId:123] Could not get information from the database',
          HttpStatus.SERVICE_UNAVAILABLE,
        ),
      );
    });
  });
});
