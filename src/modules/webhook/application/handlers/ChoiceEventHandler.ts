import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Domain
import { EventHandler } from '../../domain/EventHandler';
import { EventBody } from '../../domain/EventBody';

// Application
import { EVENT_CHAT_UPDATED_PREFERENCE } from '../../../chat/infrastructure/listeners/ChatUpdatedPreference/ChatUpdatedPreferenceListener';
import { ChatUpdatedPreferenceEvent } from '../../../chat/infrastructure/listeners/ChatUpdatedPreference/ChatUpdatedPreferenceEvent';

// Infrastructure
import LogMethod from '../../../shared/infrastructure/decorators/LogMethod';

@Injectable()
export class ChoiceEventHandler implements EventHandler {
  constructor(private eventEmitter: EventEmitter2) {}

  @LogMethod()
  async execute(data: EventBody): Promise<void> {
    const eventPayload = new ChatUpdatedPreferenceEvent({
      shippingGroupId: data.shippingGroupId,
      choice: data.payload,
    });
    this.eventEmitter.emit(EVENT_CHAT_UPDATED_PREFERENCE, eventPayload);
  }
}
