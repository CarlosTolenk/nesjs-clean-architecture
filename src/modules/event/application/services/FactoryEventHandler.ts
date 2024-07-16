import { HttpStatus, Injectable } from '@nestjs/common';

// Domain
import { ILogger } from '../../../shared/domain/Logger';
import { EventHandler } from '../../domain/EventHandler';
import { ApplicationError } from '../../../shared/domain/exception';
import { EventTypes } from '../../../shared/domain/EventTypes';

// Services
import { ChoiceEventHandler } from '../handlers/ChoiceEventHandler';
import { SubstitutionEventHandler } from '../handlers/SubstitutionEventHandler';

interface IFactoryEventHandler {
  create(eventType: string): EventHandler;
}

@Injectable()
export class FactoryEventHandler implements IFactoryEventHandler {
  private readonly availableOptions: Map<string, EventHandler> = new Map();
  constructor(
    private logger: ILogger,
    private readonly choiceEventHandler: ChoiceEventHandler,
  ) {
    this.createInstanceAvailable();
  }

  create(eventType: string): EventHandler {
    const currentEvent = this.availableOptions.get(eventType);
    this.ensureIsValidEvent(eventType, currentEvent);
    return currentEvent;
  }

  private createInstanceAvailable(): void {
    this.logger.info('Finding the event handler');
    this.availableOptions.set(
      EventTypes.WSP_PICKING_SUBSTITUTION_PREFERENCES_V1,
      this.choiceEventHandler,
    );
    this.availableOptions.set(
      EventTypes.WSP_PICKING_SUBSTITUTION_PROSPECT_APPROVAL,
      new SubstitutionEventHandler(),
    );
  }
  private ensureIsValidEvent(
    eventType: string,
    element: EventHandler | null,
  ): void {
    if (!element) {
      this.logger.error(`Event handler does not exist ${eventType}`);
      throw new ApplicationError(
        `The event:${eventType} is not valid`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
