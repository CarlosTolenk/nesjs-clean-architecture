import { HttpStatus, Injectable } from '@nestjs/common';

// Domain
import { MakeCallRepository } from '../../domain/MakeCallRepository';

// Infrastructure
import LogMethod from '../../../shared/infrastructure/decorators/LogMethod';
import { MakeCallDto } from '../../infrastructure/http/dto/makeCall.dto';
import { PayloadMakeCall } from '../../domain/valueObject/PayloadMakeCall';
import {
  ApplicationError,
  InfrastructureError,
} from '../../../shared/domain/exception';
import { DomainError } from '../../../shared/domain/exception/DomainError';

interface ICallService {
  makeCall(makeCall: MakeCallDto): Promise<PayloadMakeCall>;
}

@Injectable()
export class CallService implements ICallService {
  constructor(private readonly makeCallRepository: MakeCallRepository) {}

  @LogMethod()
  async makeCall(makeCall: MakeCallDto): Promise<PayloadMakeCall> {
    try {
      const bodyMakeCall = new PayloadMakeCall({
        shippingGroupId: makeCall.shippingGroupId,
        customerCellphone: makeCall.customerCellphone,
        pickerCellphone: makeCall.pickerCellphone,
        customerId: makeCall.customerId,
      });
      const notificationId =
        await this.makeCallRepository.execute(bodyMakeCall);
      bodyMakeCall.setNotificationId(notificationId);
      return bodyMakeCall;
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error;
      }

      if (error instanceof DomainError) {
        throw error;
      }

      throw new ApplicationError(
        `[SG:${makeCall.shippingGroupId}] Error trying to call the customer`,
        HttpStatus.CONFLICT,
      );
    }
  }
}
