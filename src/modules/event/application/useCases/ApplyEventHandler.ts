import { Injectable } from '@nestjs/common';

// Domain
import { IUseCases } from '../../../shared/domain/UseCases';
import { EventBody } from '../../domain/EventBody';

// Application
import { FactoryEventHandler } from '../services/FactoryEventHandler';

// Infrastructure
import { EventPayload } from '../../infrastructure/http/dto/eventRequestDto';
import { EventResultDto } from '../../infrastructure/http/dto/eventResult.dto';

@Injectable()
export class ApplyEventHandler
  implements IUseCases<EventPayload, EventResultDto>
{
  constructor(private readonly factoryEventHandler: FactoryEventHandler) {}
  async execute(params: EventPayload): Promise<EventResultDto> {
    try {
      const handleEvent = this.factoryEventHandler.create(params.event);
      const eventBody = this.createEventBody(params);
      await handleEvent.execute(eventBody);
      return EventResultDto.OK();
    } catch (error) {
      throw error;
    }
  }

  private createEventBody(params: EventPayload): EventBody {
    return new EventBody({
      event: params.event,
      shippingGroupId: params.shippingGroupId,
      payload: params.payload,
    });
  }
}
