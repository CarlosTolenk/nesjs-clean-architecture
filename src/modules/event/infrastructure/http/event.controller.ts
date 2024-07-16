import { ApiTags, ApiHeaders } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { serviceRegistryHeaders } from '../../../../assets/serviceRegistryHeadersObject.json';

// Domain
import { ILogger } from '../../../shared/domain/Logger';

// Application
import { ApplyEventHandler } from '../../application/useCases/ApplyEventHandler';

// Infrastructure
import { EventPayload, EventRequestDto } from './dto/eventRequestDto';

@ApiTags('event')
@ApiHeaders(serviceRegistryHeaders)
@Controller('event')
export class EventController {
  constructor(
    private readonly logger: ILogger,
    private readonly useCase: ApplyEventHandler,
  ) {}

  @Post()
  @HttpCode(200)
  async applyHandlerEvent(@Body() body: EventRequestDto): Promise<any> {
    try {
      const eventPayload = new EventPayload(body);
      await this.useCase.execute(eventPayload);
      return {
        status: 'OK',
        message: 'Received',
        eventType: eventPayload.event,
      };
    } catch (error) {
      this.logger.error('Error to hit event', { error });
      throw error;
    }
  }
}
