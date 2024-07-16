import { Injectable } from '@nestjs/common';

// Domain
import { IUseCases } from '../../../shared/domain/UseCases';
import { ILogger } from '../../../shared/domain/Logger';
import { PhoneCallRepository } from '../../domain/PhoneCallRepository';
import { PhoneCall } from '../../domain/PhoneCall';
import { PayloadMakeCall } from '../../domain/valueObject/PayloadMakeCall';

// Infrastructure
import LogMethod from '../../../shared/infrastructure/decorators/LogMethod';
import { MakeCallDto } from '../../infrastructure/http/dto/makeCall.dto';
import { MakeCallResponseDto } from '../../infrastructure/http/dto/makeCallResponse.dto';

// Services
import { CallService } from '../services/CallServices';

@Injectable()
export class MakeCall implements IUseCases<MakeCallDto, MakeCallResponseDto> {
  constructor(
    private readonly logger: ILogger,
    private readonly callService: CallService,
    private readonly phoneCallRepository: PhoneCallRepository,
  ) {}

  @LogMethod()
  async execute(params: MakeCallDto): Promise<MakeCallResponseDto> {
    const { shippingGroupId, customerId } = params;
    try {
      const callMade: PayloadMakeCall = await this.callService.makeCall(params);
      const phoneCall = this.createPhoneCall(callMade, customerId);

      await this.phoneCallRepository.save(phoneCall);

      return MakeCallResponseDto.OK(phoneCall.notificationId);
    } catch (error) {
      this.logger.error(
        `[SG:${shippingGroupId}] A problem has occurred trying to call the customer`,
        { ...error },
      );
      throw error;
    }
  }
  private createPhoneCall(
    callMade: PayloadMakeCall,
    customerId: string,
  ): PhoneCall {
    const primitives = callMade.toPrimitives();
    return PhoneCall.create({
      shippingGroupId: primitives.shippingGroupId,
      customerPhone: primitives.customer.cellphone,
      pickerPhone: primitives.from.cellphone,
      notificationId: primitives.notificationId,
      date: primitives.sendingDate,
      customerId: customerId,
    });
  }
}
