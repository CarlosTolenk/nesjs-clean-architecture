import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';

// Domain
import { PhoneCallRepository } from '../../domain/PhoneCallRepository';
import { PhoneCall } from '../../domain/PhoneCall';
import { PayloadMakeCall } from '../../domain/valueObject/PayloadMakeCall';
import { InfrastructureError } from '../../../shared/domain/exception';

// Infrastructure
import { PhoneCallEntity } from './entities/PhoneCall.entity';
import LogMethod from '../../../shared/infrastructure/decorators/LogMethod';

@Injectable()
export class PhoneCallRepositoryAzure extends PhoneCallRepository {
  constructor(
    @InjectRepository(PhoneCallEntity)
    private readonly phoneCallRepository: Repository<PhoneCallEntity>,
  ) {
    super();
  }
  @LogMethod()
  async getAllByShippingGroup(shippingGroupId: string): Promise<PhoneCall[]> {
    try {
      const phoneCallEntities = await this.phoneCallRepository.find({
        where: {
          shippingGroupId: shippingGroupId,
        },
      });

      if (!phoneCallEntities) {
        throw new InfrastructureError('Not phoneCalls', HttpStatus.NOT_FOUND);
      }

      const phoneCall = this.toDomain(phoneCallEntities);
      return Promise.resolve(phoneCall);
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error;
      }
      throw new InfrastructureError(
        `[SG:${shippingGroupId}] Could not get information from the database`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private toDomain(entities: PhoneCallEntity[]): PhoneCall[] {
    return entities.map((entities) => PhoneCall.create({ ...entities }));
  }

  @LogMethod()
  async save(phoneCall: PhoneCall): Promise<void> {
    try {
      const {
        shippingGroupId,
        customerPhone,
        pickerPhone,
        date,
        notificationId,
        customerId,
      } = phoneCall.toPrimitives();

      const entity = PhoneCallEntity.create({
        shippingGroupId: shippingGroupId,
        customerPhone: customerPhone,
        pickerPhone: pickerPhone,
        customerId: customerId,
        notificationId: notificationId,
        sendingDate: date,
      });

      await this.phoneCallRepository.save(entity);
    } catch (error) {
      const { shippingGroupId } = phoneCall.toPrimitives();
      throw new InfrastructureError(
        `[SG:${shippingGroupId}] Could not save information from the database`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
