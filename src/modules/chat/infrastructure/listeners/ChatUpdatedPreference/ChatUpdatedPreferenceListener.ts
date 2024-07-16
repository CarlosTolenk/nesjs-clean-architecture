import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export const EVENT_CHAT_UPDATED_PREFERENCE = 'chat.updatedPreference';

// Application
import { ChatUpdatedPreferenceEvent } from './ChatUpdatedPreferenceEvent';
import { UpdatePreferenceChoice } from '../../../application/useCases/UpdatePreferenceChoice';

// Infrastructure
import { UpdateChatByChoiceDto } from '../../http/dto/updateChatByChoice.dto';

@Injectable()
export class ChatUpdatedPreferenceListener {
  constructor(private readonly useCase: UpdatePreferenceChoice) {}
  @OnEvent(EVENT_CHAT_UPDATED_PREFERENCE)
  async handleChatUpdatedPreferenceEvent(event: ChatUpdatedPreferenceEvent) {
    const update = new UpdateChatByChoiceDto();
    update.shippingGroupId = event.shippingGroupId;
    update.choice = event.choice;

    return this.useCase.execute(update);
  }
}
