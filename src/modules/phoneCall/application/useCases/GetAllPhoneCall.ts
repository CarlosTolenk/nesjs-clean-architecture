import { Injectable } from '@nestjs/common';

// Domain
import { IUseCases } from '../../../shared/domain/UseCases';
import { PhoneCallRepository } from '../../domain/PhoneCallRepository';
import { PhoneCall } from '../../domain/PhoneCall';

// Infrastructure
import LogMethod from '../../../shared/infrastructure/decorators/LogMethod';
import { SearchShippingGroupIdDto } from '../../infrastructure/http/dto/searchShippingGroupId.dto';
import { PhoneCallDto } from '../../infrastructure/http/dto/phoneCall.dto';

@Injectable()
export class GetAllPhoneCall
  implements IUseCases<SearchShippingGroupIdDto, PhoneCallDto[]>
{
  constructor(private phoneRepository: PhoneCallRepository) {}

  @LogMethod()
  async execute({
    shippingGroupId,
  }: SearchShippingGroupIdDto): Promise<PhoneCallDto[]> {
    try {
      const phoneCalls =
        await this.phoneRepository.getAllByShippingGroup(shippingGroupId);
      const mapped = this.mapToPrimitives(phoneCalls);
      return Promise.resolve(mapped);
    } catch (error) {
      throw error;
    }
  }

  private mapToPrimitives(phoneCalls: PhoneCall[]): PhoneCallDto[] {
    return phoneCalls.map((phoneCall) => {
      const primitives = phoneCall.toPrimitives();
      return {
        id: primitives.id,
        shippingGroupId: primitives.shippingGroupId,
        answer: primitives.answer,
        customerPhone: primitives.customerPhone,
        pickerPhone: primitives.pickerPhone,
        date: primitives.date,
        duration: primitives.duration,
      };
    });
  }
}
