import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';

// Domain
import { InfrastructureError } from '../../../../../src/modules/shared/domain/exception';
import { PhoneCall } from '../../../../../src/modules/phoneCall/domain/PhoneCall';

// Infrastructure
import { PhoneCallRepositoryAzure } from '../../../../../src/modules/phoneCall/infrastructure/persistence/PhoneCallRepositoryAzure';
import { PhoneCallEntity } from '../../../../../src/modules/phoneCall/infrastructure/persistence/entities/PhoneCall.entity';

describe('PhoneCallRepositoryAzure', () => {
  let phoneCallRepositoryAzure: PhoneCallRepositoryAzure;
  let phoneCallRepository: Repository<PhoneCallEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PhoneCallRepositoryAzure,
        {
          provide: getRepositoryToken(PhoneCallEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    phoneCallRepositoryAzure = moduleRef.get<PhoneCallRepositoryAzure>(
      PhoneCallRepositoryAzure,
    );
    phoneCallRepository = moduleRef.get<Repository<PhoneCallEntity>>(
      getRepositoryToken(PhoneCallEntity),
    );
  });

  it('should be defined', () => {
    expect(phoneCallRepositoryAzure).toBeDefined();
    expect(phoneCallRepository).toBeDefined();
  });

  describe('getAllByShippingGroup', () => {
    it('should return an object from the domain correctly', async () => {
      const shippingGroupId = '123';
      const phoneCallEntity: PhoneCallEntity[] = [
        PhoneCallEntity.create({
          shippingGroupId: 'shippingGroupId1',
          customerPhone: '56952158950',
          pickerPhone: '56952158951',
          customerId: 'customerId',
          sendingDate: 'sendingDate',
          notificationId: 'notificationId1',
        }),
        PhoneCallEntity.create({
          shippingGroupId: 'shippingGroupId2',
          customerPhone: '56952158950',
          pickerPhone: '56952158951',
          customerId: 'customerId',
          sendingDate: 'sendingDate',
          notificationId: 'notificationId2',
        }),
      ];

      jest
        .spyOn(phoneCallRepository, 'find')
        .mockResolvedValue(phoneCallEntity);

      const result =
        await phoneCallRepositoryAzure.getAllByShippingGroup(shippingGroupId);

      expect(result).toEqual([
        {
          answer: 'N/A',
          customerPhone: {
            value: '56952158950',
          },
          date: 'sendingDate',
          duration: 'N/A',
          id: expect.any(String),
          notificationId: 'notificationId1',
          pickerPhone: {
            value: '56952158951',
          },
          shippingGroupId: {
            value: 'shippingGroupId1',
          },
          customerId: {
            value: 'customerId',
          },
        },
        {
          answer: 'N/A',
          customerPhone: {
            value: '56952158950',
          },
          date: 'sendingDate',
          duration: 'N/A',
          id: expect.any(String),
          notificationId: 'notificationId2',
          pickerPhone: {
            value: '56952158951',
          },
          shippingGroupId: {
            value: 'shippingGroupId2',
          },
          customerId: {
            value: 'customerId',
          },
        },
      ]);
    });

    it('should throw an exception when the phoneCall does not exist', async () => {
      const shippingGroupId = '123';
      jest.spyOn(phoneCallRepository, 'find').mockResolvedValue(undefined);

      await expect(
        phoneCallRepositoryAzure.getAllByShippingGroup(shippingGroupId),
      ).rejects.toThrowError(
        new InfrastructureError('Not phoneCalls', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception when the phoneCall is array empty', async () => {
      const shippingGroupId = '123';
      jest.spyOn(phoneCallRepository, 'find').mockResolvedValue([]);

      const result =
        await phoneCallRepositoryAzure.getAllByShippingGroup(shippingGroupId);

      expect(result).toEqual([]);
    });

    it('should throw an exception when unexpected error', async () => {
      const shippingGroupId = '123';
      jest
        .spyOn(phoneCallRepository, 'find')
        .mockRejectedValue(new Error('error'));

      await expect(
        phoneCallRepositoryAzure.getAllByShippingGroup(shippingGroupId),
      ).rejects.toThrowError(
        new InfrastructureError(
          '[SG:123] Could not get information from the database',
          HttpStatus.SERVICE_UNAVAILABLE,
        ),
      );
    });
  });

  describe('save', () => {
    it('should', async () => {
      const shippingGroupId = 'shippingGroupId';
      const customerCellphone = '56952158950';
      const pickerCellphone = '56952158951';
      const customerId = 'customerId';
      const notificationId = 'notificationId';
      const sendingDate = 'sendingDate';

      const payload = PhoneCall.create({
        shippingGroupId,
        customerPhone: customerCellphone,
        pickerPhone: pickerCellphone,
        date: sendingDate,
        notificationId,
        customerId: customerId,
      });

      jest.spyOn(phoneCallRepository, 'save').mockResolvedValue(
        PhoneCallEntity.create({
          shippingGroupId: shippingGroupId,
          customerPhone: customerCellphone,
          pickerPhone: pickerCellphone,
          customerId: 'customerId',
          sendingDate: sendingDate,
          notificationId,
        }),
      );

      await phoneCallRepositoryAzure.save(payload);
    });
    it('should throw error', async () => {
      const shippingGroupId = 'shippingGroupId';
      const customerCellphone = '56952158950';
      const pickerCellphone = '56952158951';
      const customerId = 'customerId';
      const notificationId = 'notificationId';
      const sendingDate = 'sendingDate';

      const payload = PhoneCall.create({
        shippingGroupId,
        customerPhone: customerCellphone,
        pickerPhone: pickerCellphone,
        date: sendingDate,
        notificationId,
        customerId: customerId,
      });

      jest
        .spyOn(phoneCallRepository, 'save')
        .mockRejectedValue(new Error('Error'));

      await expect(phoneCallRepositoryAzure.save(payload)).rejects.toThrowError(
        new InfrastructureError(
          '[SG:shippingGroupId] Could not save information from the database',
          HttpStatus.SERVICE_UNAVAILABLE,
        ),
      );
    });
  });
});
